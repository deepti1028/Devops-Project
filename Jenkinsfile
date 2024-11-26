pipeline {
    agent any

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
    }
    
    post {
        always {
            // Stop and remove the containers
            sh '/usr/local/bin/docker-compose down'

            echo 'Pipeline completed'
        }
    }
}