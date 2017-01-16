#!groovy

node {

    def nodeHome = tool name: 'bitmate-generator-node', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"
    currentBuild.result = "SUCCESS"

    try {

       stage('Check Environment'){
           sh "node -v"
           sh "npm -v"
       }

       stage('Checkout'){
            properties([pipelineTriggers([[$class: 'GitHubPushTrigger'], pollSCM('H/15 * * * *')])])
            checkout scm
       }

       stage('Setup Environment'){
            sh "npm set registry http://sinopia.bitmate.io"
            sh "npm set progress=false"
            sh "npm install"
            sh "git submodule update --init --recursive"
            sh "npm run linkAll"
       }

       stage('Testing'){
            sh 'npm run test'
       }
    }


    catch (err) {

        currentBuild.result = "FAILURE"

        throw err

    }

}
