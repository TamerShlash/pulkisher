$(document).ready(function() {
  $.ajaxSetup({ cache: true });
  $.getScript('https://connect.facebook.net/en_US/sdk.js', function() {
    FB.init({
      appId: '392982790763746',
      xfbml: true,
      version: 'v2.3'
    });
    $('#loginbutton,#feedbutton').removeAttr('disabled');
    // The state of person visiting this page the can be:
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into your app or not.
    FB.getLoginStatus(statusChangeCallback);
  });
  $('#publish').click(doPublish);
  $('#selectall').click(selectAll);
});

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log(response);
  $('#status').html("");
  $('#groups').html('');
  if (response.status === 'connected') {
    listGroups();
  } else if (response.status === 'not_authorized') {
    $('#status').html('Please log into this app.');
  } else {
    $('#status').html('Please log into Facebook.');
  }
};

function listGroups() {
  FB.api('/me/groups?fields=id,name,icon,link,privacy,description&limit=50000',
    function(response) {
      groups = response.data;
      groupsList = $('#groups');
      groups.forEach(function(group) {
        groupsList.append(
          '<li>' +
            '<input type="checkbox" value="' + group.id + '"/>' +
            '<img src="' + group.icon + '"/>' +
            '<a target="_blank" href="https://www.facebook.com/groups/' + group.id + '/">' +
              group.name +
            '</a>' +
          '</li>'
        );
      });
    }
  );
};

function doPublish() {
  ctype = $('[name=ctype]:checked').val();
  message = $('#message').val();
  link = $('#link').val();
  edge = '';
  params = {};
  if (ctype == 'text') {
    params = { 'message': message };
    edge = 'feed';
  } else if (ctype == 'link') {
    params = { 'message': message, 'link': link };
    edge = 'feed';
  } else if (ctype == 'photo') {
    params = { 'message': message, 'url': link };
    edge = 'photos';
  } else if (ctype == 'video') {
    params = {
      'file_url': link,
      'description': message,
      'title': $('#vidtitle').val()
    };
    edge = 'videos';
  } else {
    alert('Choose a post type, idiot!');
    return;
  }
  schedule(edge, params)
};

function schedule(edge, params) {
  interval = parseInt($('#interval').val());
  $('#groups li :checked').each(function(index, group) {
    setTimeout(function() {
      FB.api('/' + group.value + '/' + edge,
          'POST',
          params,
          function(response) {
            if (response && !response.error) {
              console.log("Success!");
              console.log(response);
            } else {
              console.error("Problem!");
              console.log(response);
            }
          }
      );
    }, index * interval * 1000);
  });
};
function selectAll() {
  $('#groups li input[type=checkbox]').each(function(index, elem) {
    $(elem).prop('checked', true)
  });
}
