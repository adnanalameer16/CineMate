pipeline {
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
                # Use 'curl' to download instead of wget
                curl -sSLo sonar-scanner-cli.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
                
                # Use Java's built-in 'jar' command to extract the zip file, 
                # bypassing the need for a separate unzip tool!
                jar xf sonar-scanner-cli.zip
                '''
            }
        }

        stage('Run SonarQube Scan') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                    # Tell Jenkins exactly where the extracted scanner is
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
