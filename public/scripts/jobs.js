$(function() {
    function do_work () {
        var workers = scheduler.free();
        if (!workers) {
            console.log('No free workers');
            return;
        }

        $.get('/api/jobs/' + workers).done(function(jobs) {
            if (!jobs.length) {
                console.log('Server has no jobs');
                return;
            }

            console.log('Got ' + jobs.length + ' jobs');
            jobs.forEach(function(job) {  
                console.log('Starting job');
                scheduler.eval(job.data, function(result) {
                    console.log('Coputed', job.data, result);
                    $.post('/api/jobs/' + job.id, {
                        result: result
                    }).done(function(resp) {
                        console.log('updated');
                    }).fail(function(err) {
                        console.log('fail', err);
                    });
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