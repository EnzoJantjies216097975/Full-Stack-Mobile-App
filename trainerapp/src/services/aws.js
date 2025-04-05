import { 
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails
  } from 'amazon-cognito-identity-js';
  import AWS from 'aws-sdk';
  import { v4 as uuidv4 } from 'uuid';
  
  // AWS Configuration - replace with your actual config
  const awsConfig = {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_CLIENT_ID,
    identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID,
    bucketName: process.env.REACT_APP_AWS_S3_BUCKET_NAME
  };
  
  const userPool = new CognitoUserPool({
    UserPoolId: awsConfig.userPoolId,
    ClientId: awsConfig.userPoolWebClientId
  });
  
  // Cognito Authentication Service
  export const cognitoAuthService = {
    register: async (email, password, userAttributes = {}) => {
      return new Promise((resolve, reject) => {
        const attributeList = [];
        
        // Convert user attributes to Cognito format
        for (const key in userAttributes) {
          const attribute = {
            Name: key,
            Value: userAttributes[key]
          };
          attributeList.push(new CognitoUserAttribute(attribute));
        }
        
        userPool.signUp(email, password, attributeList, null, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result.user);
        });
      });
    },
    
    confirmRegistration: async (email, confirmationCode) => {
      return new Promise((resolve, reject) => {
        const cognitoUser = new CognitoUser({
          Username: email,
          Pool: userPool
        });
        
        cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    },
    
    login: async (email, password) => {
      return new Promise((resolve, reject) => {
        const authenticationDetails = new AuthenticationDetails({
          Username: email,
          Password: password
        });
        
        const cognitoUser = new CognitoUser({
          Username: email,
          Pool: userPool
        });
        
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            // Cache the auth tokens
            const idToken = result.getIdToken().getJwtToken();
            const accessToken = result.getAccessToken().getJwtToken();
            const refreshToken = result.getRefreshToken().getToken();
            
            // Set AWS credentials for S3, Lambda, etc.
            AWS.config.region = awsConfig.region;
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: awsConfig.identityPoolId,
              Logins: {
                [`cognito-idp.${awsConfig.region}.amazonaws.com/${awsConfig.userPoolId}`]: idToken
              }
            });
            
            resolve({
              user: cognitoUser,
              tokens: { idToken, accessToken, refreshToken }
            });
          },
          onFailure: (err) => {
            reject(err);
          }
        });
      });
    },
    
    logout: () => {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut();
      }
    },
    
    getCurrentUser: () => {
      return new Promise((resolve, reject) => {
        const cognitoUser = userPool.getCurrentUser();
        
        if (!cognitoUser) {
          resolve(null);
          return;
        }
        
        cognitoUser.getSession((err, session) => {
          if (err) {
            reject(err);
            return;
          }
          
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err);
              return;
            }
            
            const userData = {};
            for (let attribute of attributes) {
              userData[attribute.getName()] = attribute.getValue();
            }
            
            resolve({
              user: cognitoUser,
              session,
              attributes: userData
            });
          });
        });
      });
    },
    
    forgotPassword: (email) => {
      return new Promise((resolve, reject) => {
        const cognitoUser = new CognitoUser({
          Username: email,
          Pool: userPool
        });
        
        cognitoUser.forgotPassword({
          onSuccess: (data) => {
            resolve(data);
          },
          onFailure: (err) => {
            reject(err);
          }
        });
      });
    },
    
    confirmPassword: (email, verificationCode, newPassword) => {
      return new Promise((resolve, reject) => {
        const cognitoUser = new CognitoUser({
          Username: email,
          Pool: userPool
        });
        
        cognitoUser.confirmPassword(verificationCode, newPassword, {
          onSuccess: () => {
            resolve();
          },
          onFailure: (err) => {
            reject(err);
          }
        });
      });
    },
    
    refreshSession: () => {
      return new Promise((resolve, reject) => {
        const cognitoUser = userPool.getCurrentUser();
        
        if (!cognitoUser) {
          reject(new Error('No current user'));
          return;
        }
        
        cognitoUser.getSession((err, session) => {
          if (err) {
            reject(err);
            return;
          }
          
          // Refresh the credentials
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: awsConfig.identityPoolId,
            Logins: {
              [`cognito-idp.${awsConfig.region}.amazonaws.com/${awsConfig.userPoolId}`]: session.getIdToken().getJwtToken()
            }
          });
          
          AWS.config.credentials.refresh((err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(session);
          });
        });
      });
    }
  };
  
  // Initialize AWS SDK
  AWS.config.region = awsConfig.region;
  
  // S3 File Storage Service
  export const s3Service = {
    uploadFile: async (file, folder = '') => {
      try {
        // Make sure AWS credentials are available
        if (!AWS.config.credentials) {
          await cognitoAuthService.refreshSession();
        }
        
        const s3 = new AWS.S3();
        const fileName = `${folder}/${uuidv4()}-${file.name}`;
        
        const params = {
          Bucket: awsConfig.bucketName,
          Key: fileName,
          Body: file,
          ContentType: file.type,
          ACL: 'public-read'
        };
        
        const { Location } = await s3.upload(params).promise();
        return Location;
      } catch (error) {
        throw error;
      }
    },
    
    uploadExerciseVideo: async (file, exerciseId) => {
      return s3Service.uploadFile(file, `exercises/${exerciseId}`);
    },
    
    uploadProfileImage: async (file, userId) => {
      return s3Service.uploadFile(file, `profiles/${userId}`);
    },
    
    deleteFile: async (fileUrl) => {
      try {
        // Make sure AWS credentials are available
        if (!AWS.config.credentials) {
          await cognitoAuthService.refreshSession();
        }
        
        const s3 = new AWS.S3();
        
        // Extract key from URL
        const url = new URL(fileUrl);
        const key = url.pathname.substring(1); // Remove leading '/'
        
        const params = {
          Bucket: awsConfig.bucketName,
          Key: key
        };
        
        await s3.deleteObject(params).promise();
      } catch (error) {
        throw error;
      }
    }
  };
  
  // DynamoDB Service
  export const dynamoDBService = {
    getDocClient: async () => {
      // Make sure AWS credentials are available
      if (!AWS.config.credentials) {
        await cognitoAuthService.refreshSession();
      }
      
      return new AWS.DynamoDB.DocumentClient();
    },
    
    // User Profile Operations
    createUserProfile: async (userId, userData) => {
      try {
        const docClient = await dynamoDBService.getDocClient();
        
        const params = {
          TableName: 'UserProfiles',
          Item: {
            userId,
            ...userData,
            createdAt: new Date().toISOString()
          }
        };
        
        await docClient.put(params).promise();
      } catch (error) {
        throw error;
      }
    },
    
    getUserProfile: async (userId) => {
      try {
        const docClient = await dynamoDBService.getDocClient();
        
        const params = {
          TableName: 'UserProfiles',
          Key: { userId }
        };
        
        const result = await docClient.get(params).promise();
        return result.Item;
      } catch (error) {
        throw error;
      }
    },
    
    updateUserProfile: async (userId, updateData) => {
      try {
        const docClient = await dynamoDBService.getDocClient();
        
        // Build update expression dynamically
        let updateExpression = 'set';
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
        
        Object.entries(updateData).forEach(([key, value], index) => {
          const prefix = index === 0 ? ' ' : ', ';
          updateExpression += `${prefix}#${key} = :${key}`;
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = value;
        });
        
        // Add updatedAt timestamp
        updateExpression += ', #updatedAt = :updatedAt';
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();
        
        const params = {
          TableName: 'UserProfiles',
          Key: { userId },
          UpdateExpression: updateExpression,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues
        };
        
        await docClient.update(params).promise();
      } catch (error) {
        throw error;
      }
    },
    
    // Exercise Management
    createExercise: async (exerciseData) => {
      try {
        const docClient = await dynamoDBService.getDocClient();
        const exerciseId = uuidv4();
        
        const params = {
          TableName: 'Exercises',
          Item: {
            exerciseId,
            ...exerciseData,
            createdAt: new Date().toISOString()
          }
        };
        
        await docClient.put(params).promise();
        return exerciseId;
      } catch (error) {
        throw error;
      }
    },
    
    getExercises: async (trainerId = null) => {
      try {
        const docClient = await dynamoDBService.getDocClient();
        
        let params = {
          TableName: 'Exercises'
        };
        
        if (trainerId) {
          params = {
            TableName: 'Exercises',
            IndexName: 'TrainerIdIndex',
            KeyConditionExpression: 'trainerId = :trainerId',
            ExpressionAttributeValues: {
              ':trainerId': trainerId
            }
          };
        }
        
        const result = await docClient.scan(params).promise();
        return result.Items;
      } catch (error) {
        throw error;
      }
    },
    
    // Workout Programs
    createProgram: async (programData) => {
      try {
        const docClient = await dynamoDBService.getDocClient();
        const programId = uuidv4();
        
        const params = {
          TableName: 'WorkoutPrograms',
          Item: {
            programId,
            ...programData,
            createdAt: new Date().toISOString()
          }
        };
        
        await docClient.put(params).promise();
        return programId;
      } catch (error) {
        throw error;
      }
    },
    
    getPrograms: async (trainerId = null) => {
      try {
        const docClient = await dynamoDBService.getDocClient();
        
        let params = {
          TableName: 'WorkoutPrograms'
        };
        
        if (trainerId) {
          params = {
            TableName: 'WorkoutPrograms',
            IndexName: 'TrainerIdIndex',
            KeyConditionExpression: 'trainerId = :trainerId',
            ExpressionAttributeValues: {
              ':trainerId': trainerId
            }
          };
        }
        
        const result = await docClient.scan(params).promise();
        return result.Items;
      } catch (error) {
        throw error;
      }
    },
    
    // Trainee Progress Tracking
    recordWorkout: async (workoutData) => {
      try {
        const docClient = await dynamoDBService.getDocClient();
        const workoutId = uuidv4();
        
        const params = {
          TableName: 'WorkoutLogs',
          Item: {
            workoutId,
            ...workoutData,
            timestamp: new Date().toISOString()
          }
        };
        
        await docClient.put(params).promise();
        return workoutId;
      } catch (error) {
        throw error;
      }
    },
    
    getTraineeWorkouts: async (traineeId, startDate, endDate) => {
      try {
        const docClient = await dynamoDBService.getDocClient();
        
        const params = {
          TableName: 'WorkoutLogs',
          IndexName: 'TraineeIdIndex',
          KeyConditionExpression: 'traineeId = :traineeId and #timestamp BETWEEN :startDate AND :endDate',
          ExpressionAttributeNames: {
            '#timestamp': 'timestamp'
          },
          ExpressionAttributeValues: {
            ':traineeId': traineeId,
            ':startDate': startDate,
            ':endDate': endDate
          }
        };
        
        const result = await docClient.query(params).promise();
        return result.Items;
      } catch (error) {
        throw error;
      }
    },
    
    // Food Intake Tracking
    recordFoodIntake: async (foodData) => {
      try {
        const docClient = await dynamoDBService.getDocClient();
        const entryId = uuidv4();
        
        const params = {
          TableName: 'FoodIntake',
          Item: {
            entryId,
            ...foodData,
            timestamp: new Date().toISOString()
          }
        };
        
        await docClient.put(params).promise();
        return entryId;
      } catch (error) {
        throw error;
      }
    },
    
    getTraineeFoodIntake: async (traineeId, startDate, endDate) => {
      try {
        const docClient = await dynamoDBService.getDocClient();
        
        const params = {
          TableName: 'FoodIntake',
          IndexName: 'TraineeIdIndex',
          KeyConditionExpression: 'traineeId = :traineeId and #timestamp BETWEEN :startDate AND :endDate',
          ExpressionAttributeNames: {
            '#timestamp': 'timestamp'
          },
          ExpressionAttributeValues: {
            ':traineeId': traineeId,
            ':startDate': startDate,
            ':endDate': endDate
          }
        };
        
        const result = await docClient.query(params).promise();
        return result.Items;
      } catch (error) {
        throw error;
      }
    }
  };
  
  // AWS Lambda Functions
  export const lambdaService = {
    invokeFunction: async (functionName, payload) => {
      try {
        // Make sure AWS credentials are available
        if (!AWS.config.credentials) {
          await cognitoAuthService.refreshSession();
        }
        
        const lambda = new AWS.Lambda();
        
        const params = {
          FunctionName: functionName,
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify(payload)
        };
        
        const response = await lambda.invoke(params).promise();
        
        if (response.StatusCode !== 200) {
          throw new Error(`Lambda invocation failed with status code ${response.StatusCode}`);
        }
        
        // Parse the response payload
        if (response.Payload) {
          return JSON.parse(response.Payload);
        }
        
        return null;
      } catch (error) {
        throw error;
      }
    },
    
    // Common Lambda functions for the fitness app
    generateWorkoutPlan: async (traineeId, preferences) => {
      try {
        return await lambdaService.invokeFunction('generateWorkoutPlan', {
          traineeId,
          preferences
        });
      } catch (error) {
        throw error;
      }
    },
    
    calculateNutritionStats: async (traineeId, startDate, endDate) => {
      try {
        return await lambdaService.invokeFunction('calculateNutritionStats', {
          traineeId,
          startDate,
          endDate
        });
      } catch (error) {
        throw error;
      }
    },
    
    analyzeFitnessProgress: async (traineeId, startDate, endDate) => {
      try {
        return await lambdaService.invokeFunction('analyzeFitnessProgress', {
          traineeId,
          startDate,
          endDate
        });
      } catch (error) {
        throw error;
      }
    }
  };
  
  // Amazon SES Email Service
  export const sesService = {
    sendEmail: async (to, subject, body, isHtml = false) => {
      try {
        // Make sure AWS credentials are available
        if (!AWS.config.credentials) {
          await cognitoAuthService.refreshSession();
        }
        
        const ses = new AWS.SES();
        
        const params = {
          Destination: {
            ToAddresses: Array.isArray(to) ? to : [to]
          },
          Message: {
            Body: isHtml
              ? {
                  Html: {
                    Charset: 'UTF-8',
                    Data: body
                  }
                }
              : {
                  Text: {
                    Charset: 'UTF-8',
                    Data: body
                  }
                },
            Subject: {
              Charset: 'UTF-8',
              Data: subject
            }
          },
          Source: process.env.REACT_APP_SES_SENDER_EMAIL
        };
        
        return await ses.sendEmail(params).promise();
      } catch (error) {
        throw error;
      }
    },
    
    // Templated emails for common fitness app scenarios
    sendWelcomeEmail: async (userEmail, userName) => {
      const subject = 'Welcome to Fitness Bootcamp!';
      const body = `
        <h1>Welcome to Fitness Bootcamp, ${userName}!</h1>
        <p>We're excited to have you join our fitness community. Here's what you can do to get started:</p>
        <ul>
          <li>Complete your profile</li>
          <li>Browse available workout programs</li>
          <li>Join an upcoming online class</li>
          <li>Set your fitness goals</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact your trainer.</p>
        <p>Let's get fit together!</p>
      `;
      
      return await sesService.sendEmail(userEmail, subject, body, true);
    },
    
    sendClassReminderEmail: async (userEmail, userName, classDetails) => {
      const subject = `Reminder: ${classDetails.title} class starting soon`;
      const body = `
        <h1>Your class is starting soon!</h1>
        <p>Hello ${userName},</p>
        <p>This is a reminder that your ${classDetails.title} class is starting in 30 minutes.</p>
        <h2>Class Details:</h2>
        <ul>
          <li><strong>Title:</strong> ${classDetails.title}</li>
          <li><strong>Time:</strong> ${new Date(classDetails.dateTime).toLocaleString()}</li>
          <li><strong>Duration:</strong> ${classDetails.duration} minutes</li>
          <li><strong>Trainer:</strong> ${classDetails.trainerName}</li>
        </ul>
        <p>Join using the following Zoom link: <a href="${classDetails.zoomLink}">${classDetails.zoomLink}</a></p>
        <p>Remember to have your water bottle and workout gear ready!</p>
      `;
      
      return await sesService.sendEmail(userEmail, subject, body, true);
    },
    
    sendWorkoutSummaryEmail: async (userEmail, userName, workoutSummary) => {
      const subject = 'Your Weekly Workout Summary';
      const body = `
        <h1>Weekly Workout Summary</h1>
        <p>Hello ${userName},</p>
        <p>Here's a summary of your workouts for the past week:</p>
        <ul>
          <li><strong>Workouts Completed:</strong> ${workoutSummary.completedWorkouts}</li>
          <li><strong>Total Time:</strong> ${workoutSummary.totalTime} minutes</li>
          <li><strong>Total Calories Burned:</strong> ${workoutSummary.totalCalories}</li>
          <li><strong>Achievement Rate:</strong> ${workoutSummary.achievementRate}%</li>
        </ul>
        <h2>Your Top Exercises:</h2>
        <ol>
          ${workoutSummary.topExercises.map(ex => `<li>${ex.name} - ${ex.count} times</li>`).join('')}
        </ol>
        <p>Keep up the good work!</p>
      `;
      
      return await sesService.sendEmail(userEmail, subject, body, true);
    }
  };
  
  // Amazon SNS Notification Service
  export const snsService = {
    createPlatformEndpoint: async (deviceToken, userId) => {
      try {
        // Make sure AWS credentials are available
        if (!AWS.config.credentials) {
          await cognitoAuthService.refreshSession();
        }
        
        const sns = new AWS.SNS();
        
        const params = {
          PlatformApplicationArn: process.env.REACT_APP_SNS_PLATFORM_APP_ARN,
          Token: deviceToken,
          CustomUserData: userId
        };
        
        const response = await sns.createPlatformEndpoint(params).promise();
        return response.EndpointArn;
      } catch (error) {
        throw error;
      }
    },
    
    sendPushNotification: async (endpointArn, title, body, data = {}) => {
      try {
        // Make sure AWS credentials are available
        if (!AWS.config.credentials) {
          await cognitoAuthService.refreshSession();
        }
        
        const sns = new AWS.SNS();
        
        const message = {
          default: body,
          GCM: JSON.stringify({
            notification: {
              title,
              body
            },
            data
          }),
          APNS: JSON.stringify({
            aps: {
              alert: {
                title,
                body
              },
              sound: 'default'
            },
            ...data
          })
        };
        
        const params = {
          Message: JSON.stringify(message),
          MessageStructure: 'json',
          TargetArn: endpointArn
        };
        
        return await sns.publish(params).promise();
      } catch (error) {
        throw error;
      }
    },
    
    // Common push notifications for fitness app
    sendWorkoutReminder: async (endpointArn, workoutDetails) => {
      return await snsService.sendPushNotification(
        endpointArn,
        'Workout Reminder',
        `Don't forget your scheduled ${workoutDetails.name} workout today!`,
        {
          type: 'workout_reminder',
          workoutId: workoutDetails.id
        }
      );
    },
    
    sendClassNotification: async (endpointArn, classDetails) => {
      return await snsService.sendPushNotification(
        endpointArn,
        'Class Starting Soon',
        `Your ${classDetails.title} class starts in 15 minutes`,
        {
          type: 'class_reminder',
          classId: classDetails.id,
          zoomLink: classDetails.zoomLink
        }
      );
    },
    
    sendAchievementNotification: async (endpointArn, achievementDetails) => {
      return await snsService.sendPushNotification(
        endpointArn,
        'Achievement Unlocked!',
        `Congratulations! You've earned the "${achievementDetails.name}" badge`,
        {
          type: 'achievement',
          achievementId: achievementDetails.id
        }
      );
    }
  };
  
  // AWS AppSync GraphQL Service
  export const appSyncService = {
    getClient: () => {
      // Make sure AWS authentication is handled
      const appSyncConfig = {
        url: process.env.REACT_APP_APPSYNC_URL,
        region: awsConfig.region,
        auth: {
          type: 'AMAZON_COGNITO_USER_POOLS',
          jwtToken: () => {
            const cognitoUser = userPool.getCurrentUser();
            if (!cognitoUser) return null;
            
            return new Promise((resolve, reject) => {
              cognitoUser.getSession((err, session) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(session.getIdToken().getJwtToken());
              });
            });
          }
        }
      };
      
      return new AWS.AppSync(appSyncConfig);
    },
    
    // Helper function to execute GraphQL queries
    execute: async (query, variables = {}) => {
      const client = appSyncService.getClient();
      
      const request = {
        query,
        variables
      };
      
      try {
        const response = await client.graphql({ query: request.query, variables: request.variables });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    // Queries & Mutations for the fitness app
    getTrainerDashboard: async (trainerId) => {
      const query = `
        query GetTrainerDashboard($trainerId: ID!) {
          getTrainerDashboard(trainerId: $trainerId) {
            totalTrainees
            activeTrainees
            upcomingClasses {
              id
              title
              dateTime
              participantCount
            }
            recentMessages {
              id
              traineeId
              traineeName
              message
              timestamp
              read
            }
          }
        }
      `;
      
      return await appSyncService.execute(query, { trainerId });
    },
    
    getTraineeProgress: async (traineeId) => {
      const query = `
        query GetTraineeProgress($traineeId: ID!) {
          getTraineeProgress(traineeId: $traineeId) {
            currentProgram {
              id
              name
              progress
            }
            weeklyStats {
              workoutsCompleted
              totalMinutes
              caloriesBurned
            }
            nutritionSummary {
              averageCalories
              proteinPercentage
              carbsPercentage
              fatsPercentage
            }
            strengthProgress {
              date
              benchPress
              squat
              deadlift
            }
          }
        }
      `;
      
      return await appSyncService.execute(query, { traineeId });
    },
    
    createNewProgram: async (programData) => {
      const mutation = `
        mutation CreateProgram($input: CreateProgramInput!) {
          createProgram(input: $input) {
            id
            name
            description
            difficulty
            exercises {
              id
              name
              sets
              reps
              duration
            }
          }
        }
      `;
      
      return await appSyncService.execute(mutation, { input: programData });
    }
  };
  
  // AWS CloudWatch Metrics Service
  export const cloudWatchService = {
    publishMetrics: async (metricData) => {
      try {
        // Make sure AWS credentials are available
        if (!AWS.config.credentials) {
          await cognitoAuthService.refreshSession();
        }
        
        const cloudWatch = new AWS.CloudWatch();
        
        const params = {
          MetricData: metricData,
          Namespace: 'FitnessBootcamp'
        };
        
        return await cloudWatch.putMetricData(params).promise();
      } catch (error) {
        throw error;
      }
    },
    
    // Common app metrics
    recordUserLogin: async (userId, userType) => {
      const metrics = [
        {
          MetricName: 'UserLogin',
          Dimensions: [
            {
              Name: 'UserType',
              Value: userType
            }
          ],
          Value: 1,
          Unit: 'Count'
        }
      ];
      
      return await cloudWatchService.publishMetrics(metrics);
    },
    
    recordWorkoutCompletion: async (programType, difficulty) => {
      const metrics = [
        {
          MetricName: 'WorkoutCompletion',
          Dimensions: [
            {
              Name: 'ProgramType',
              Value: programType
            },
            {
              Name: 'Difficulty',
              Value: difficulty
            }
          ],
          Value: 1,
          Unit: 'Count'
        }
      ];
      
      return await cloudWatchService.publishMetrics(metrics);
    }
  };
  
  // Export AWS config for other services to use
  export { AWS, awsConfig, userPool };
  