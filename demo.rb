require 'koala'

ACCESS_TOKEN = ""
user = Koala::Facebook::API.new("ACCESS_TOKEN")

# do some validations on the token

groups = graph.get_connections('me', 'groups')

groups.each do |group|
  user.put_connections(
    group['id'],
    'feed',
    message: 'Foo Bar Baz Quux'
  )
end
