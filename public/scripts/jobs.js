$(function() {
    $('#post-new-job').submit(function() {
        var data = $(this).find('textarea').val();
        $.ajax({
            url: '/api/jobs',
            type: 'PUT',
            data: {
                data: data
            }
        }).done(function(res) {
            console.log(res);
        }).fail(function(err) {
            console.log('fail', err);
        });
        return false;
    });



    $('#run-job').click(function() {
        $.get('/api/jobs/1').done(function(jobs) {
            var job = jobs[0];
            scheduler.eval(job.data, function(result) {
                console.log('res', result);
                $.post('/api/jobs/' + job._id, {
                    result: result
                }).done(function(resp) {
                    console.log('updated');
                }).fail(function(err) {
                    console.log('fail', err);
                });
            });
        }).fail(function(err) {
            console.log(err);
        });
    });
});