pipeline {
    // Run on the main server directly
    agent any

    environment {
        SONAR_HOST_URL = 'http://host.docker.internal:9000' 
        SONAR_PROJECT_KEY = 'cinemate'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        stage('Download SonarScanner') {
            steps {
                sh '''
                # Download the free Sonar scanner tool directly from SonarSource
                wget -q https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
                
                # Unzip the downloaded file
                unzip -q -o sonar-scanner-cli-5.0.1.3006-linux.zip
                '''
            }
        }

        stage('Run SonarQube Scan') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                    # THIS LINE IS CRITICAL: It tells Jenkins where the scanner is
                    export PATH=$WORKSPACE/sonar-scanner-5.0.1.3006-linux/bin:$PATH

                    # Run the scan!
                    sonar-scanner \
                      -Dsonar.projectKey=$SONAR_PROJECT_KEY \
                      -Dsonar.sources=cinemate \
                      -Dsonar.host.url=$SONAR_HOST_URL \
                      -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }
    }
}
