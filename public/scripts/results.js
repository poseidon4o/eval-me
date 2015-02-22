$(function() {
    $.get('/api/results').done(function(data) {
        data.forEach(function(result) {
            $('.results').append('<div><input readonly value="'+result.result+'"/><br/><textarea readonly>' + result.data + '</textarea></div><hr>')
        });
    }).fail(function(err) {
        console.log('Failed to get results', err);
    })
});