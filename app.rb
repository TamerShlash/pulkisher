require 'sinatra'
require 'koala'

# set :bind, '0.0.0.0'

get '/' do
  File.read(File.join('public', 'index.html'))
  # send_file('index.html')
end

post '/token' do
  # generate sever-side access token
end

post '/publish' do
  # post to the specified groups
  user = Koala::Facebook::API.new('ACCESS_TOKEN')

  # do some validations on the token
  group_ids = params['groups']
  group_ids.each do |group_id|
    user.put_connections(
      group_id,
      'feed',
      message: 'Foo Bar Baz Quux'
    )
  end
end
