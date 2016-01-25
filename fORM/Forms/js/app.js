$(document).foundation();

var fireBaseRef = new Firebase("https://hiring-day.firebaseio.com/");

$("#submit-btn").bind("click",function(){
    var comment = $("#comments");
    var comment_value = $.trim(comment.val());
    
    if(comment_value.length==0){
        alert('comments are required to continue');
    }
    else{
    fireBaseRef.push({comment: comment_value}, function(error){
        if (error!==null){
            alert('unable to send a message');
        }
    });
    
    comment.val("");
    }
    return false;
});

fireBaseRef.on('child_added', function(snapshot) {
            var uniqName = snapshot.name();
            var comment = snapshot.val().comment;
            var commentsContainer = $('#comments-container');
 
            $('<div/>', {class: 'comment-container'})
                .html('<span class="label label-default">Comment ' 
                    + uniqName + '</span>' + comment).appendTo(commentsContainer);
 
            commentsContainer.scrollTop(commentsContainer.prop('scrollHeight'));
        });
