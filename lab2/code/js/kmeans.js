/**
 * @Created Jan 25, 2018
 * @LastUpdate Jan 31, 2020
 * @author Kahin Akram
 */

function kmeans(data, k) {

    //Crap we need
    var qualityChange = 0;
    var oldqualitycheck = 0;
    var qualitycheck = 0;

    //Parse the data from strings to floats
    var new_array = parseData(data);

    //Task 4.1 - Select random k centroids
    var centroid = initCentroids(new_array,k);

    //Prepare the array for different cluster indices
    //var clusterIndexPerPoint = new Array(new_array.length).fill(0);

    //Task 4.2 - Assign each point to the closest mean.
    var clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);

    //Master loop -- Loop until quality is good
    do {

        //Task 4.3 - Compute mean of each cluster
        centroid = computeClusterMeans(new_array, clusterIndexPerPoint, k);
        // assign each point to the closest mean.
        clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);

        //Task 4.4 - Do a quality check for current result
        oldqualitycheck = qualitycheck;
        qualitycheck = qualityCheck(centroid,new_array,clusterIndexPerPoint);
        qualityChange = Math.abs(oldqualitycheck - qualitycheck);

        console.log(qualityChange)
        
    } while (qualityChange > 0.0000000001)

    //Return results
    return {
        assignments: clusterIndexPerPoint
    };
}

/**
 * Parse data from strings to floats
 * Loop over data length
      loop over every i in data
        Fill array with parsed values, use parseFloat
 * @param {*} data
 * @return {array}
 */
function parseData(data){
    var new_array = data.map(point => {
        return Object.keys(point).map(key => {
            return parseFloat(point[key])
        })
    })
    return new_array;
}

/**
 * Task 4.1 - Randomly place K points
 * Loop over data and Use floor and random in Math
 * @return {array} centroid
 */

function initCentroids(data, k){
    var centroid = Array.from(new Array(k)).map(() => {
        return data[Math.floor(Math.random() * data.length)]
    })

    return centroid;
}

/**
* Taks 4.2 - Assign each item to the cluster that has the closest centroid
* Loop over points and fill array, use findClosestMeanIndex(points[i],means)
* Return an array of closest mean index for each point.
* @param points
* @param means
* @return {Array}
*/

function assignPointsToMeans(points, means){
    return points.map(point => {
        return findClosestMeanIndex(point, means)
    }); 
}
/**
 * Calculate the distance to each mean, then return the index of the closest.
 * Loop over menas and fill distance array, use euclideanDistance(point,means[i])
 * return closest cluster use findIndexOfMinimum,
 * @param point
 * @param means
 * @return {Number}
*/
function findClosestMeanIndex(point, means){

    var distance = Number.MAX_SAFE_INTEGER
    var closestMeanIndex = 0

    means.forEach((mean,i) => {
        let tempDistance = euclideanDistance(point, mean)
        if(tempDistance < distance) {
            distance = tempDistance
            closestMeanIndex = i
        }
    });

    return closestMeanIndex
};
/**
 * Euclidean distance between two points in arbitrary dimension(column/axis)
 * @param {*} point1
 * @param {*} point2
 * @return {Number}
 */

function euclideanDistance(point1, point2){

    var distance = 0
   
    if (point1.length != point2.length)
        throw ("point1 and point2 must be of same dimension");
    else {
        for (var key in point1) {
            distance += (point1[key] - point2[key]) * (point1[key] - point2[key])
        }
        distance = Math.sqrt(distance)
    }

    return distance;

}

/**
 * Return the index of the smallest value in the array.
 *  Loop over the array and find index of minimum
 * @param array
 * @return {Number}
 */
function findIndexOfMinimum(array){
    return array
}

/**
 * //Task 4.3 - Compute mean of each cluster
 * For each cluster loop over assignment and check if ass. equal to cluster index
 * if true fill array
 * then if array is not empty fill newMeans, use averagePosition(array)
 * @param {*} points
 * @param {*} assignments
 * @param {*} k
 * @returns {array}
 */
function computeClusterMeans(points, assignments, k){

    var newMeans = [];

    if (points.length != assignments.length)
        throw ("points and assignments arrays must be of same dimension");
    else {
        for (let i = 0; i < k; i++) {

            let cluster = []

            points.forEach((point, j) => {
                if(assignments[j] == i) {
                    cluster.push(point)
                }
            })
            
            if(cluster.length > 0) {
                var newPoint = averagePosition(cluster)
                newMeans.push(newPoint)
            }
        }
    }

    return newMeans;
}

/**
 * Calculate quality of the results
 * For each centroid loop new_array and check if clusterIndexPerPoint equal clsuter
 * if true loop over centriod and calculate qualitycheck.
 * @param {*} centroid
 * @param {*} new_array
 * @param {*} clusterIndexPerPoint
 */
function qualityCheck(centroid, new_array, clusterIndexPerPoint){
    
    var quality = 0

    new_array.forEach((point,i) => {
        let newClosestClusterIndex = findClosestMeanIndex(point, centroid)

        if(newClosestClusterIndex == clusterIndexPerPoint[i]) {
            centroid.forEach(val => {
                quality += euclideanDistance(val, point);
            });
        }
    });
    
    return quality;

}

/**
 * Calculate average of points
 * @param {*} points
 * @return {number}
 */
function averagePosition(points){

    var sums = points[0];
    for (var i = 1; i < points.length; i++){
        var point = points[i];
        for (var j = 0; j < point.length; j++){
            sums[j] += point[j];
        }
    }

    for (var k = 0; k < sums.length; k++)
        sums[k] /= points.length;

    return sums;
}
