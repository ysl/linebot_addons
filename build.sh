#!/bin/bash -x

set -e

VERSION=${1}
APP_ENV=${2}
BUILD_FOLDER=build
OUTPUT_FOLDER=output

if [[ "${1}" == "" ]]; then
    echo "Missing version argument"
    exit 1
fi

if [[ "${2}" == "" ]]; then
    echo "Missing env argument: production or development"
    exit 1
fi

if [[ "${2}" == "production" ]]; then
    ASSET_ROOT="hermes-questionnaire-prod"
else
    ASSET_ROOT="hermes-questionnaire-dev"
fi

[ -d ${BUILD_FOLDER} ] && rm -rf ${BUILD_FOLDER}
mkdir ${BUILD_FOLDER}

git archive HEAD | tar -x -C ./${BUILD_FOLDER}/

# Build
(cd ${BUILD_FOLDER} && composer install && npm install && npm run prod)
(cd ${BUILD_FOLDER} && chmod -R 777 storage bootstrap/cache)

# Create symbolic links
(cd ${BUILD_FOLDER}/public/images && ln -s /opt/efs/${ASSET_ROOT}/output output)

# Pack
[ -d ${OUTPUT_FOLDER} ] && rm -rf ${OUTPUT_FOLDER}
mkdir ${OUTPUT_FOLDER}
(cd ${BUILD_FOLDER} && zip --symlinks -rq ../${OUTPUT_FOLDER}/${VERSION}.zip ./* -x node_modules/\*)
