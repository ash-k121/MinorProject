const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker'); // Using the @faker-js/faker package

// Connect to MongoDB (local MongoDB instance)
mongoose.connect('mongodb+srv://ashintern121:wMsTvDM4sRuir0j7@cluster0.30apc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB compass!'))
  .catch(err => console.error("Could not connect to MongoDB:", err));

// Import your schema (schemas)
const User = require('./userSchema'); // Assuming the schema files are in the same folder
const Post = require('./postSchema');
const Comment = require('./commentSchema');
const Like = require('./likesSchema');
const Follower = require('./followersSchema');
const Message = require('./messageSchema');

// Function to generate fake users
const createFakeUsers = async (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = new User({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
      profile_picture: faker.image.avatar(),
      bio: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(['active', 'inactive', 'banned'])
    });
    users.push(user.save());
  }
  return await Promise.all(users);
};

// Function to generate fake posts
const createFakePosts = async (users, count) => {
  const posts = [];
  for (let i = 0; i < count; i++) {
    const post = new Post({
      user_id: faker.helpers.arrayElement(users)._id,
      content: faker.lorem.paragraph(),
      // media_url: faker.image.imageUrl(),
      visibility: faker.helpers.arrayElement(['public', 'private', 'friends'])
    });
    posts.push(post.save());
  }
  return await Promise.all(posts);
};

// Function to generate fake comments
const createFakeComments = async (users, posts, count) => {
  const comments = [];
  for (let i = 0; i < count; i++) {
    const comment = new Comment({
      post_id: faker.helpers.arrayElement(posts)._id,
      user_id: faker.helpers.arrayElement(users)._id,
      comment_text: faker.lorem.sentence()
    });
    comments.push(comment.save());
  }
  return await Promise.all(comments);
};

// Function to generate fake likes
const createFakeLikes = async (users, posts, count) => {
  const likes = [];
  for (let i = 0; i < count; i++) {
    const like = new Like({
      post_id: faker.helpers.arrayElement(posts)._id,
      user_id: faker.helpers.arrayElement(users)._id
    });
    likes.push(like.save());
  }
  return await Promise.all(likes);
};

// Function to generate fake followers
const createFakeFollowers = async (users, count) => {
  const followers = [];
  for (let i = 0; i < count; i++) {
    const follower = new Follower({
      follower_user_id: faker.helpers.arrayElement(users)._id,
      followed_user_id: faker.helpers.arrayElement(users)._id
    });
    followers.push(follower.save());
  }
  return await Promise.all(followers);
};

// Function to generate fake messages
const createFakeMessages = async (users, count) => {
  const messages = [];
  for (let i = 0; i < count; i++) {
    const message = new Message({
      sender_id: faker.helpers.arrayElement(users)._id,
      receiver_id: faker.helpers.arrayElement(users)._id,
      message_text: faker.lorem.sentence(),
      is_read: faker.datatype.boolean()
    });
    messages.push(message.save());
  }
  return await Promise.all(messages);
};

// Main function to generate and insert data
const generateData = async () => {
  try {
    console.log("Generating fake data...");
    
    // Insert 20 users
    const users = await createFakeUsers(20);
    console.log('Inserted 20 users.');

    // Insert 20 posts
    const posts = await createFakePosts(users, 20);
    console.log('Inserted 20 posts.');

    // Insert 20 comments
    await createFakeComments(users, posts, 20);
    console.log('Inserted 20 comments.');

    // Insert 20 likes
    await createFakeLikes(users, posts, 20);
    console.log('Inserted 20 likes.');

    // Insert 20 followers
    await createFakeFollowers(users, 20);
    console.log('Inserted 20 followers.');

    // Insert 20 messages
    await createFakeMessages(users, 20);
    console.log('Inserted 20 messages.');

    console.log('Data generation complete.');
  } catch (err) {
    console.error('Error generating data:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Call the main function
generateData();
