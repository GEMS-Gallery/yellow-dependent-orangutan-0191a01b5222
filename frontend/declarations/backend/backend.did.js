export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Post = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'body' : IDL.Text,
    'author' : IDL.Text,
    'timestamp' : Time,
  });
  return IDL.Service({
    'createPost' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    'getPosts' : IDL.Func([], [IDL.Vec(Post)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
