import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FriendsCard } from "../Components/FriendsCard";
import { PostCard } from "../Components/PostCard";
import { ProfileCard } from "../Components/ProfileCard";
import { Topbar } from "../Components/Topbar";
import { Loading } from "../Components/Loading";
import { apiRequest, deletePost, fetchPosts, getUserInfo, likePost } from "../apiHelper/index.mjs";
// import { posts } from '../assets/data'

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(false);
  const uri = "/posts/get-user-post" + id;

  const fetchPost = async () => {
    await fetchPosts(user?.token, dispatch);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deletePost(id, user?.token);
    await fetchPost();
    // await getPosts();
  };
  const handleLikePost = async (uri) => {
    await likePost({ uri: uri, token: user?.token });
    await fetchPost();
    // await getPosts();
  };

  const getUser = async () => {
    const res = await getUserInfo(user?.token, id);
    setUserInfo(res);
  };

  const getPosts = async () => {
    await fetchPosts(user?.token, dispatch, uri);
    setLoading(false);
  };

  const viewProfile = async (data) => {
    try {
      const result = await apiRequest({
        url: "users/profile-view",
        token: user?.token,
        method: "POST",
        data: data
      });
      console.log(result, "view Profil");
      // getUser();
      // const newUser = { token: result?.message?.token, ...result?.message?.user };
      // dispatch(UserLogin(newUser));
      // setFriendRequest(result?.message?.data);
    }
    catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    viewProfile({ id: id });
    // setLoading(true);
    // getUser();
    // getPosts();
  }, [id]);

  return (
    <>
      <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <Topbar />
        <div className='w-full flex gap-2 lg:gap-4 md:pl-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={userInfo} />

            <div className='block lg:hidden'>
              <FriendsCard friends={userInfo?.friends} />
            </div>
          </div>

          {/* CENTER */}
          <div className=' flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto'>
            {loading ? (
              <Loading />
            ) : posts?.filter((post) => { return ((id) === (post?.userId?._id)); })?.length > 0 ? (
              posts?.filter((post) => { return ((id) === (post?.userId?._id)); })?.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
      </div>
    </>
  );
};

export { Profile };