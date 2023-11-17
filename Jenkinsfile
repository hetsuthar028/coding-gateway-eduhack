pipeline {
    agent {
        label 'new_server'
    }
    environment {
       
        DOCKER_CREDS = credentials('bismabaig')
    }
    stages {
        stage('Git') {
            steps {
                git credentialsId: 'githubnew', url: 'https://github.com/BismaNaeemBaig31/nodejs-example-with-mongo-atlas.git'
            }
        }
        stage('Main Branch') {
            when {
                expression {
                    return env.BRANCH_NAME == 'main'
                }
            }
            steps {
                script {
                    docker login -u $DOCKER_CREDS_USR -p $DOCKER_CREDS_PSW
                    docker build . "-t bismabaig/node-app:$BUILD_ID -t bismabaig/nodejs:prod-$BUILD_ID"
                    docker push "bismabaig/node-app:$BUILD_ID"
                }
            }
        }
        stage('Dev Branch') {
            when {
                expression {
                    return env.BRANCH_NAME == 'dev'
                }
            }
            steps {
                script {
                    docker build . "-t bismabaig/nodejs:$BUILD_ID -t bismabaig/nodejs:dev-$BUILD_ID"
                    docker push "bismabaig/nodejs:$BUILD_ID"
                }
            }
        }
    } // end of stages
