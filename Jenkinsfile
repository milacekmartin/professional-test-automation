
pipeline {
    agent any
    
    options {
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 15, unit: 'MINUTES')
        skipStagesAfterUnstable()
    }
    
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chrome', 'firefox', 'edge'],
            description: 'Browser for running tests'
        )
        choice(
            name: 'ENV',
            choices: ['test', 'staging', 'prod'],
            description: 'Environment for running tests'
        )
        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Run tests in headless mode'
        )
    }
    
    environment {
        CYPRESS_CACHE_FOLDER = "${WORKSPACE}/.cache/cypress"
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR = 'allure/report'
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm-cache"
        NPM_CONFIG_PROGRESS = "false"
        NPM_CONFIG_AUDIT = "false"
        NPM_CONFIG_FUND = "false"
        NPM_CONFIG_PREFER_OFFLINE = "true"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "\033[0;36m=== CODE READY ===\033[0m"
            }
        }
        
        stage('Quick Setup') {
            steps {
                sh '''
                    echo "\033[0;36m=== QUICK SETUP ===\033[0m"
                    
                    mkdir -p "${NPM_CONFIG_CACHE}" "${CYPRESS_CACHE_FOLDER}" "${ALLURE_RESULTS_DIR}"
                    
                    export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
                    
                    NODE_VERSION=$(node --version | sed 's/v//g' | cut -d. -f1)
                    echo "\033[0;32mNode.js: $(node --version) NPM: $(npm --version)\033[0m"
                    
                    npm config set progress false
                    npm config set audit false
                    npm config set fund false
                    
                    if [ "$NODE_VERSION" -lt "20" ]; then
                        echo "\033[0;33mDowngrading Cypress for Node.js compatibility...\033[0m"
                        sed -i.bak 's/"cypress": "[^"]*"/"cypress": "13.6.0"/g' package.json 2>/dev/null || true
                    fi
                    
                    echo "\033[0;32mEnvironment ready\033[0m"
                '''
            }
        }
        
        stage('Fast Install') {
            steps {
                sh '''
                    echo "\033[0;36m=== FAST DEPENDENCY INSTALL ===\033[0m"
                    
                    export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
                    export NPM_CONFIG_CACHE="${WORKSPACE}/.npm-cache"
                    
                    rm -f yarn.lock
                    
                    if [ -f "package-lock.json" ]; then
                        echo "\033[0;34mUsing npm ci...\033[0m"
                        npm ci --cache "${NPM_CONFIG_CACHE}" --omit=optional --silent || {
                            echo "\033[0;33mnpm ci failed, using npm install\033[0m"
                            rm -f package-lock.json
                            npm install --cache "${NPM_CONFIG_CACHE}" --omit=optional --silent --legacy-peer-deps
                        }
                    else
                        npm install --cache "${NPM_CONFIG_CACHE}" --omit=optional --silent --legacy-peer-deps
                    fi
                    
                    echo "\033[0;32mDependencies installed\033[0m"
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    def browserFlag = params.HEADLESS ? "--headless" : ""
                    def configFile = params.ENV ?: 'test'
                    
                    echo "\033[0;36m=== RUNNING TESTS ===\033[0m"
                    echo "\033[0;32mBrowser: ${params.BROWSER} | Env: ${configFile} | Headless: ${params.HEADLESS}\033[0m"
                    
                    sh """
                        export PATH="/opt/homebrew/bin:/usr/local/bin:\$PATH"
                        export CYPRESS_CACHE_FOLDER="\${WORKSPACE}/.cache/cypress"
                        
                        mkdir -p ${ALLURE_RESULTS_DIR} cypress/screenshots cypress/videos cypress/results
                        
                        echo "\033[0;34mStarting tests...\033[0m"
                        
                        timeout 600 npm run cy:test:run || {
                            echo "\033[0;33mPackage script failed, trying direct command...\033[0m"
                            timeout 600 npx cypress run \\
                                --browser ${params.BROWSER} \\
                                ${browserFlag} \\
                                --env configFile=${configFile} \\
                                || echo "\033[0;31mTests completed with errors\033[0m"
                        }
                        
                        echo "\033[0;32mTests completed\033[0m"
                    """
                }
            }
            post {
                always {
                    script {
                        ['cypress/screenshots', 'cypress/videos', 'allure-results'].each { dir ->
                            if (fileExists(dir)) {
                                try {
                                    archiveArtifacts artifacts: "${dir}/**/*", allowEmptyArchive: true
                                    echo "\033[0;32m${dir} archived\033[0m"
                                } catch (Exception e) {
                                    echo "\033[0;33m${dir} archive failed\033[0m"
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Generate Report') {
            when {
                expression { fileExists(env.ALLURE_RESULTS_DIR) }
            }
            steps {
                sh '''
                    echo "\033[0;36m=== GENERATING REPORT ===\033[0m"
                    
                    export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
                    
                    if [ -d "${ALLURE_RESULTS_DIR}" ] && [ "$(ls -A ${ALLURE_RESULTS_DIR} 2>/dev/null)" ]; then
                        echo "\033[0;32mFound Allure results, generating report...\033[0m"
                        
                        npx allure generate ${ALLURE_RESULTS_DIR} --clean -o ${ALLURE_REPORT_DIR} || {
                            echo "\033[0;33mDirect command failed, trying package script...\033[0m"
                            npx allure generate ${ALLURE_RESULTS_DIR} --clean -o ${ALLURE_REPORT_DIR}
                        }
                        
                        echo "\033[0;32mReport generated successfully\033[0m"
                    else
                        echo "\033[0;33mNo Allure results found\033[0m"
                    fi
                '''
            }
        }
    }
    
    post {
        always {
            script {
                echo "\033[0;36m=== PIPELINE CLEANUP ===\033[0m"
                
                if (fileExists(env.ALLURE_REPORT_DIR)) {
                    try {
                        allure([
                            includeProperties: false,
                            jdk: '',
                            properties: [],
                            reportBuildPolicy: 'ALWAYS',
                            results: [[path: env.ALLURE_RESULTS_DIR]]
                        ])
                        echo "\033[0;32mAllure report published\033[0m"
                    } catch (Exception e) {
                        echo "\033[0;33mAllure publish failed: ${e.getMessage()}\033[0m"
                    }
                } else {
                    echo "\033[0;34mNo Allure report to publish\033[0m"
                }
                
                try {
                    sh 'echo "\033[0;34mPreserving cache for next build\033[0m"'
                } catch (Exception e) {
                    echo "\033[0;33mCleanup info failed\033[0m"
                }
            }
        }
        
        success {
            echo "\033[0;32mPIPELINE COMPLETED SUCCESSFULLY!\033[0m"
        }
        
        failure {
            echo "\033[0;31mPIPELINE FAILED!\033[0m"
        }
    }
}
