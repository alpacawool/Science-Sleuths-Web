// Count number of true / false in observation list and return as array of  integers
export const getTrueFalseData = (observationsList, questionIndex) => {
    
    var trueCount = 0;
    var falseCount = 0;

    for (var i=0 ; i < observationsList.length; i++ ) {
        if (observationsList[i].responses[questionIndex].response === "True") {
            trueCount++;
        } else {
            falseCount++;
        }
    }
    
    return [trueCount, falseCount];
}

// Based on the length of the observation list, returns consecutive string number list
export const getNumericLabels = (observationsList) => {
    var label_array = [];

    for (var i=0; i < observationsList.length; i++ ) {
        label_array.push((i+1).toString())
    }

    return label_array;
}

// Get numeric data from each observation list response
export const getNumericData = (observationsList, questionIndex) => {
    var response_array = [];

    for (var i=0 ; i < observationsList.length; i++ ) {
        response_array.push(observationsList[i].responses[questionIndex].response)
    }

    return response_array;
}

// Count multiple choice data and return as array of integers
export const getMultipleChoiceData = (observationsList, questionIndex, choices) => {
    
    var choice_dict = {};
    var response_count_dict = {};
    var response_array = []

    for (var i=0 ; i < choices.length; i++ ) {
        choice_dict[i] = choices[i];
        response_count_dict[choices[i]] = 0;
    }

    for (var i=0 ; i < observationsList.length; i++ ) {
        var integer_answer = observationsList[i].responses[questionIndex].response;
        var string_answer = choice_dict[integer_answer];
        response_count_dict[string_answer]++;
    }
    
    for (var i=0; i < choices.length; i++) {
        response_array.push(response_count_dict[choice_dict[i]]);
    }

    return response_array
}