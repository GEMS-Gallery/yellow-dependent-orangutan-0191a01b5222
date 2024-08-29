import Text "mo:base/Text";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Nat "mo:base/Nat";

actor {
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  stable var nextPostId: Nat = 0;
  stable var posts: [Post] = [];

  public func createPost(title: Text, body: Text, author: Text) : async Nat {
    let post: Post = {
      id = nextPostId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextPostId += 1;
    nextPostId - 1
  };

  public query func getPosts() : async [Post] {
    Array.reverse(posts)
  };
}
