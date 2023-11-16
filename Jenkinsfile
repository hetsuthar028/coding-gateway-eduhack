pipeline {
    agent {
        label 'new_server'
    }

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('bismabaig') // Use your DockerHub credentials ID
        DOCKER_IMAGE_NAME = 'bismabaig/node-app' // Replace with your DockerHub username and desired image name
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        DOCKER_PASSWORD = 'dckr_pat__sA_DskaI2GcAGMPxNHz2uIaJoA'
        DOCKER_USERNAME = 'bismabaig'
    }

    stages {
        stage('Build') {
            steps {
                script {
                    // Simple Docker build command
                    sh 'docker build -t $DOCKER_IMAGE_NAME .'

                    // Log in to DockerHub
                    withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDENTIALS, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                    }

                    // Push the Docker image to DockerHub
                    sh "docker push $DOCKER_IMAGE_NAME"
                }
            }
        }

        stage('Run') {
            steps {
                script {
                    // Use the image from the Docker Compose file and run the container
                    sh "docker-compose -f $DOCKER_COMPOSE_FILE up -d"
                }
            }
        }
    }

    post {
        success {
            // Clean up: Log out from DockerHub
            script {
                sh 'docker logout'
            }
        }
    }
}
