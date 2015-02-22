$(function() {
    function do_work () {
        if (!scheduler.free()) {
            console.log('No free workers');
            return;
        }

        $.get('/api/jobs/1').done(function(jobs) {
            if (!jobs.length) {
                console.log('Server has no jobs');
                return;
            }
            var job = jobs[0];
            scheduler.eval(job.data, function(result) {
                console.log('Coputed', job.data, result);
                $.post('/api/jobs/' + job._id, {
                    result: result
                }).done(function(resp) {
                    console.log('updated');
                }).fail(function(err) {
                    console.log('fail', err);
                });
            });
        }).fail(function(err) {
            console.log('Failed to get jobs', err);
        });
    }

    var interval = null;



    $('#post-new-job').submit(function() {
        var data = $(this).find('textarea').val();
        $(this).find('textarea').val('');
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
        console.log('Starting....');
        interval = setInterval(do_work, 500);
    });

    $('#stop-job').click(function() {
        console.log('Stopping....');
        clearInterval(interval);
    });
});