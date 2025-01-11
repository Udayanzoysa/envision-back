const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const { title, slug, content, teaser, category, cover_img, tags } = req.body;

    // Create the post with the incoming data
    const post = await Post.create({
      title,
      slug,
      content,
      teaser,
      category,
      cover_img,
      tags,
      UserId: req.user.id, // Assuming `req.user.id` contains the logged-in user ID
    });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({ where: { UserId: req.user.id } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

exports.getPublishPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { status: "published" }, // Filter by published status and the user's ID
      include: [
        {
          model: User, // Include the User model (author)
          attributes: ["id", "slug", "first_name", "last_name", "imgix_url"], // Select necessary fields from the User model
        },
      ],
    });

    // Format posts into the required response structure
    const formattedPosts = posts.map((post) => {
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        metadata: {
          author: {
            title: `${post.User.full_name}`,
            slug: post.User.slug,
            metadata: {
              image: post.User.imgix_url,
            },
          },
          published_date: post.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          hero: {
            imgix_url: post.cover_img,
          },
          categories: post.category.split(",").map((cat) => ({ title: cat.trim() })),
          teaser: post.teaser,
        },
      };
    });
    // Return the formatted posts as JSON
    res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

exports.getPost = async (req, res) => {
  const { slug } = req.params; // Assuming slug is passed as a URL parameter

  try {
    // Fetch the post by slug, including the author
    const post = await Post.findOne({
      where: { slug, status: "published" }, // Filter by slug and published status
      include: [
        {
          model: User, // Include the User model (author)
          attributes: ["id", "slug", "first_name", "last_name", "imgix_url"], // Select necessary fields from the User model
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Format the post into the required response structure
    const formattedPost = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      metadata: {
        author: {
          title: `${post.User.first_name} ${post.User.last_name}`,
          slug: post.User.slug,
          metadata: {
            image: post.User.imgix_url,
          },
        },
        published_date: post.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        hero: {
          imgix_url: post.cover_img,
        },
        categories: post.category.split(",").map((cat) => ({ title: cat.trim() })),
        teaser: post.teaser,
        content: post.content,
      },
    };

    return res.status(200).json(formattedPost);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

exports.getPostByID = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id");

    const post = await Post.findOne({ where: { id } });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ post: post });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, cover_img, slug, tags, teaser } = req.body;

    const post = await Post.findOne({ where: { id, UserId: req.user.id } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.title = title;
    post.content = content;
    post.category = category;
    post.cover_img = cover_img;
    post.slug = slug;
    post.tags = tags;
    post.teaser = teaser;
    post.status = "draft";
    post.updatedAt = new Date().toISOString();

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ where: { id, UserId: req.user.id } });

    if (!post) return res.status(404).json({ message: "Post not found" });

    await post.destroy();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};
