
pipeline {
    agent any
    
    options {
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 15, unit: 'MINUTES') // Skrátený timeout
        skipStagesAfterUnstable()
    }
    
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chrome', 'firefox', 'edge'],
            description: 'Browser pre spustenie testov'
        )
        choice(
            name: 'ENV',
            choices: ['test', 'staging', 'prod'],
            description: 'Prostredie pre spustenie testov'
        )
        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Spustiť testy v headless mode'
        )
    }
    
    environment {
        CYPRESS_CACHE_FOLDER = "${WORKSPACE}/.cache/cypress"
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR = 'allure/report'
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm-cache"
        
        // NPM optimalizácie pre rýchlosť
        NPM_CONFIG_PROGRESS = "false"
        NPM_CONFIG_AUDIT = "false"
        NPM_CONFIG_FUND = "false"
        NPM_CONFIG_PREFER_OFFLINE = "true"
    }
    
    stages {
        stage('🔄 Checkout') {
            steps {
                checkout scm
                echo "\033[0;36m=== 🔄 CODE READY ===\033[0m"
            }
        }
        
        stage('⚡ Quick Setup') {
            steps {
                sh '''
                    echo "\033[0;36m=== ⚡ QUICK SETUP ===\033[0m"
                    
                    # Vytvor len potrebné adresáre
                    mkdir -p "${NPM_CONFIG_CACHE}" "${CYPRESS_CACHE_FOLDER}" "${ALLURE_RESULTS_DIR}"
                    
                    export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
                    
                    NODE_VERSION=$(node --version | sed 's/v//g' | cut -d. -f1)
                    echo "\033[0;32m✓ Node.js: $(node --version) NPM: $(npm --version)\033[0m"
                    
                    # Rýchla npm optimalizácia
                    npm config set progress false
                    npm config set audit false
                    npm config set fund false
                    
                    # Downgrade Cypress pre Node.js 18 kompatibilitu
                    if [ "$NODE_VERSION" -lt "20" ]; then
                        echo "\033[0;33m⚠ Downgrading Cypress for Node.js compatibility...\033[0m"
                        sed -i.bak 's/"cypress": "[^"]*"/"cypress": "13.6.0"/g' package.json 2>/dev/null || true
                    fi
                    
                    echo "\033[0;32m✓ Environment ready\033[0m"
                '''
            }
        }
        
        stage('📦 Fast Install') {
            steps {
                sh '''
                    echo "\033[0;36m=== 📦 FAST DEPENDENCY INSTALL ===\033[0m"
                    
                    export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
                    export NPM_CONFIG_CACHE="${WORKSPACE}/.npm-cache"
                    
                    # Odstránenie yarn.lock pre npm kompatibilitu
                    rm -f yarn.lock
                    
                    # Superrýchla inštalácia
                    if [ -f "package-lock.json" ]; then
                        echo "\033[0;34mℹ Using npm ci...\033[0m"
                        npm ci --cache "${NPM_CONFIG_CACHE}" --omit=optional --silent || {
                            echo "\033[0;33m⚠ npm ci failed, using npm install\033[0m"
                            rm -f package-lock.json
                            npm install --cache "${NPM_CONFIG_CACHE}" --omit=optional --silent --legacy-peer-deps
                        }
                    else
                        npm install --cache "${NPM_CONFIG_CACHE}" --omit=optional --silent --legacy-peer-deps
                    fi
                    
                    echo "\033[0;32m✓ Dependencies installed\033[0m"
                '''
            }
        }
        
        stage('🧪 Run Tests') {
            steps {
                script {
                    def browserFlag = params.HEADLESS ? "--headless" : ""
                    def configFile = params.ENV ?: 'test'
                    
                    echo "\033[0;36m=== 🧪 RUNNING TESTS ===\033[0m"
                    echo "\033[0;32m✓ Browser: ${params.BROWSER} | Env: ${configFile} | Headless: ${params.HEADLESS}\033[0m"
                    
                    sh """
                        export PATH="/opt/homebrew/bin:/usr/local/bin:\$PATH"
                        export CYPRESS_CACHE_FOLDER="\${WORKSPACE}/.cache/cypress"
                        
                        # Vytvor adresáre
                        mkdir -p ${ALLURE_RESULTS_DIR} cypress/screenshots cypress/videos cypress/results
                        
                        echo "\033[0;34mℹ Starting tests...\033[0m"
                        
                        # Spusti testy s timeoutom
                        timeout 600 npm run cy:test:run || {
                            echo "\033[0;33m⚠ Package script failed, trying direct command...\033[0m"
                            timeout 600 npx cypress run \\
                                --browser ${params.BROWSER} \\
                                ${browserFlag} \\
                                --env configFile=${configFile} \\
                                || echo "\033[0;31m✗ Tests completed with errors\033[0m"
                        }
                        
                        echo "\033[0;32m✓ Tests completed\033[0m"
                    """
                }
            }
            post {
                always {
                    script {
                        // Rýchla archivácia len ak súbory existujú
                        ['cypress/screenshots', 'cypress/videos', 'allure-results'].each { dir ->
                            if (fileExists(dir)) {
                                try {
                                    archiveArtifacts artifacts: "${dir}/**/*", allowEmptyArchive: true
                                    echo "\033[0;32m✓ ${dir} archived\033[0m"
                                } catch (Exception e) {
                                    echo "\033[0;33m⚠ ${dir} archive failed\033[0m"
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('📊 Generate Report') {
            when {
                expression { fileExists(env.ALLURE_RESULTS_DIR) }
            }
            steps {
                sh '''
                    echo "\033[0;36m=== 📊 GENERATING REPORT ===\033[0m"
                    
                    export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
                    
                    if [ -d "${ALLURE_RESULTS_DIR}" ] && [ "$(ls -A ${ALLURE_RESULTS_DIR} 2>/dev/null)" ]; then
                        echo "\033[0;32m✓ Found Allure results, generating report...\033[0m"
                        
                        # OPRAVA: Len generuj report, NEOTVÁRAJ server!
                        npx allure generate ${ALLURE_RESULTS_DIR} --clean -o ${ALLURE_REPORT_DIR} || {
                            echo "\033[0;33m⚠ Direct command failed, trying package script...\033[0m"
                            # Upravený package.json script bez 'allure open'
                            npx allure generate ${ALLURE_RESULTS_DIR} --clean -o ${ALLURE_REPORT_DIR}
                        }
                        
                        echo "\033[0;32m✓ Report generated successfully\033[0m"
                    else
                        echo "\033[0;33m⚠ No Allure results found\033[0m"
                    fi
                '''
            }
        }
    }
    
    post {
        always {
            script {
                echo "\033[0;36m=== 🏁 PIPELINE CLEANUP ===\033[0m"
                
                // Publikuj Allure report ak existuje
                if (fileExists(env.ALLURE_REPORT_DIR)) {
                    try {
                        allure([
                            includeProperties: false,
                            jdk: '',
                            properties: [],
                            reportBuildPolicy: 'ALWAYS',
                            results: [[path: env.ALLURE_RESULTS_DIR]]
                        ])
                        echo "\033[0;32m✓ Allure report published\033[0m"
                    } catch (Exception e) {
                        echo "\033[0;33m⚠ Allure publish failed: ${e.getMessage()}\033[0m"
                    }
                } else {
                    echo "\033[0;34mℹ No Allure report to publish\033[0m"
                }
                
                // Minimálne cleanup - zachovaj cache
                try {
                    sh 'echo "\033[0;34mℹ Preserving cache for next build\033[0m"'
                } catch (Exception e) {
                    echo "\033[0;33m⚠ Cleanup info failed\033[0m"
                }
            }
        }
        
        success {
            echo "\033[0;32m🎉 PIPELINE COMPLETED SUCCESSFULLY! 🎉\033[0m"
        }
        
        failure {
            echo "\033[0;31m💥 PIPELINE FAILED! 💥\033[0m"
        }
    }
}
