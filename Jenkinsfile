pipeline {
    agent any
    
    tools {
        nodejs 'Node'  // Specify the NodeJS installation name configured in Jenkins
    }

    stages {
        stage('Git Checkout') {
            steps {
                git url: "https://github.com/deepti1028/Devops-Project", branch: "main"
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    // Use the full path to docker-compose
                    sh '/usr/local/bin/docker-compose up -d'
                }
            }
        }

        stage('Testing') {
            steps {
                dir('backend') {
                    script {
                        sh 'npm install'
                        sh 'npm test'
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Stop and remove the containers
            sh '/usr/local/bin/docker-compose down'

            echo 'Pipeline completed'
        }
    }
}