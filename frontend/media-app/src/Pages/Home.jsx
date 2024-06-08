import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { Topbar } from '../Components/Topbar';
import { ProfileCard } from '../Components/ProfileCard';
import { FriendsCard } from '../Components/FriendsCard';
import { user, friends, requests, suggest } from '../assets/data'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import { NoProfile } from '../assets'
import { CustomButton } from '../Components/CustomButton';
import { BsPersonFillAdd } from 'react-icons/bs'
import TextInput from '../Components/TextInput';
import { useForm } from 'react-hook-form';
import { BiImages } from 'react-icons/bi'
import { BiSolidVideo } from 'react-icons/bi'
import { BsFiletypeGif } from 'react-icons/bs'
import { PostCard } from '../Components/PostCard';
import { EditProfile } from '../Components/EditProfile';
import { Loading } from '../Components/Loading';
import { apiRequest, deletePost, fetchPosts, getUserInfo, handleFileUpload, likePost, sendFriendRequest } from '../apiHelper/index.mjs';
import 'react-toastify/dist/ReactToastify.css';
import { UserLogin } from '../redux/userSlice';

function Home() {
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const { register, reset, handleSubmit, formState: { errors } } = useForm();
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const handlePostSubmit = async (data) => {
    setPosting(true);

    try {
      console.log(file, "home1");
      const uri = file && (await handleFileUpload(file));
      console.log(uri, "ok2");
      const newData = uri ? { ...data, image: uri } : data;
      console.log(newData, "ok");
      const result = await apiRequest({
        url: "/posts/create-post",
        data: newData,
        token: user?.token,
        method: "POST"
      });

      const { status } = result;
      const { message } = result.message;
      const notify = () => toast(`Status: ${status} Message: ${message}`);
      notify();
      setErrMsg(message);

      if (status === 200) {
        reset({ description: "" });
        setFile(null);
        setErrMsg("");
        await fetchPost();
      }

      setPosting(false);
    }
    catch (e) {
      setPosting(false);
      console.log(e);
    }

  };

  const fetchPost = async () => {
    await fetchPosts(user?.token, dispatch);
    setLoading(false);
  };

  const handlePostLike = async (uri) => {
    await likePost({ uri: uri, token: user?.token });
    await fetchPost();
  };

  const handleDelete = async (id) => {
    await deletePost(id, user?.token);
    await fetchPost();
  };

  const fetchFriendRequests = async () => {
    try {
      const result = await apiRequest({
        url: "users/get-friend-request",
        token: user?.token,
        method: "POST"
      });
      console.log(result, "friend-reque");
      // getUser();
      setFriendRequest(result?.message?.data);
    }
    catch (err) {
      console.log(err);
    }
  };

  const fetchSuggestedFriends = async () => {
    try {
      const result = await apiRequest({
        url: "users/suggested-friends",
        token: user?.token,
        method: "POST"
      })
      console.log(result, "sugg");
      await getUser();
      setSuggestedFriends(result?.message?.data);
    }
    catch (err) {
      console.log(err);
    }
  };

  const handleFriendRequest = async (id) => {
    try {
      const res = await sendFriendRequest(user?.token, id);
      console.log(res, "Friend Request");
      let message;
      const { status } = res;
      if (status === 201) {
        message = res?.message?.message;
      }
      else {
        message = res?.message;
      }
      // const { message } = res.message;
      const notify = () => toast(`Status: ${status} Message: ${message}`);
      notify();
      await getUser();
      await fetchFriendRequests();
      await fetchSuggestedFriends();
    }
    catch (err) {
      console.log(err);
    }
  };

  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await apiRequest({
        url: "users/accept-request",
        token: user?.token,
        method: "POST",
        data: { rid: id, status }
      });
      const statu = res?.status;
      console.log(res, "lo");
      let message;
      if (statu === 201) {
        message = res?.message?.message;
      }
      else {
        message = res?.message;
      }
      // const { message } = res.message;
      const notify = () => toast(`Status: ${statu} Message: ${message}`);
      notify();
      await getUser();
      await fetchFriendRequests();
      await fetchSuggestedFriends();
      fetchPost();
      // if (statu === 201)
      //   setFriendRequest(res?.message?.data);
    }
    catch (err) {
      console.log(err);
    }
  };

  const getUser = async () => {
    const result = await getUserInfo(user?.token);
    // console.log(result, "Get User");
    const newUser = { token: user?.token, ...result };
    dispatch(UserLogin(newUser));
  };


  useEffect(() => {
    fetchPost();
    setLoading(true);
    getUser();
    fetchFriendRequests();
    fetchSuggestedFriends();
  }, []);

  const handleSelect = (e) => {
    // console.log("Iyyinid");
    setFile(e.target.files[0]);
  };


  return (
    <>
      <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <Topbar />
        <div className='w-full flex gap-2  lg:gap-4 pt-5 pb-10 h-full'>
          {/* LEFT*/}
          <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>
          {/*CENTER*/}
          <div className='flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
            <form onSubmit={handleSubmit(handlePostSubmit)} className='bg-primary px-4 rounded-lg'>
              <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
                <img src={user?.profileUrl === "" ? NoProfile : user?.profileUrl ?? NoProfile} alt='User Image' className='w-14 h-14 rounded-full object-cover' />
                <TextInput styles='w-full rounded-full py-5' placeholder="What's on your mind..." name="description" register={register("description", { required: "Write something about the post" })} error={errors.description ? errors.description.message : ""} />
              </div>
              {errMsg?.message && (
                <span role='alert' className={`text-sm ${errMsg?.status === "failed" ? "text-red-500" : "text-green-500"} mt-0.5`}>
                  {errMsg?.message}
                </span>
              )}

              <div className='flex items-center justify-between py-4'>
                <label htmlFor='imgUpload' className='flex items-center gap-1 text-base text-ascent-2  hover:text-ascent-1 cursor-pointer'>
                  <input
                    type='file'
                    className='hidden'
                    id='imgUpload'
                    onChange={(e) => handleSelect(e)}
                    accept='.jpg , .png , .jpeg'
                  />
                  <BiImages />
                  <span>Image</span>
                </label>

                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='videoUpload'
                >
                  <input
                    type='file'
                    data-max-size='5120'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='videoUpload'
                    accept='.mp4, .wav'
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>
                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='vgifUpload'
                >
                  <input
                    type='file'
                    data-max-size='5120'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='vgifUpload'
                    accept='.gif'
                  />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>
                <div>
                  {posting ? (<Loading />) : (<CustomButton type='submit' title='Post' containerStyles='bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm' />)}
                </div>
              </div>
              {/* console.log((post?.userId?._id), (user?.userId), (user?.friends.userId.includes(post?.userId?._id))); */}
            </form>
            {loading ? (
              <Loading />
            ) : posts?.filter((post) => { return (((post?.userId?._id) === (user?.userId)) || (user?.friends.some(item => item["userId"] === post?.userId?._id))); })?.length > 0 ? (
              posts?.filter((post) => { return (((post?.userId?._id) === (user?.userId)) || (user?.friends.some(item => item["userId"] === post?.userId?._id))); })?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handlePostLike}
                />
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>
          {/*RIGHT*/}
          <div className='hidden w-1/4  h-full lg:flex flex-col gap-8 overflow-y-auto'>
            {/*FRIEND REQUEST */}
            <div className='w-full bg-primary  shadow-sm rounded-lg  px-6  py-5'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span>Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {friendRequest?.map((from) => (
                  <div key={from.userId} className='flex items-center justify-between'>
                    <Link to={"/profile/" + from.userId} className='w-full flex gap-4 items-center cursor-pointer'>
                      <img src={from?.profileUrl === "" ? NoProfile : from?.profileUrl ?? NoProfile} alt={from?.name} className='w-10 h-10 object-cover rounded-full' />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {from?.name}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {from?.profession ?? "No profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <CustomButton title="Accept" onclick={() => acceptFriendRequest(from.rid, "Accepted")} containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded full' />
                      <CustomButton title="Deny" onclick={() => acceptFriendRequest(from.rid, "Denied")} containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ToastContainer />

            {/* SUGGESTED FRIENDS */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
              <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                <span>Friend Suggestion</span>
                <span>{suggestedFriends?.length}</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {
                  suggestedFriends.map((friend) => (<div className='flex items-center justify-between' key={friend.id}>
                    <Link to={"/profile/" + friend?.id} key={friend?.id} className='w-full flex gap-4 items-center cursor pointer'>
                      <img src={friend?.profileUrl === "" ? NoProfile : friend?.profileUrl ?? NoProfile} alt={friend?.name} className='w-10 h-10 object-cover rounded-full' />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {friend?.name}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {friend?.profession ?? "No profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex-gap-1'>
                      <button className='bg-[#0444a430] text-sm text-white p-1 rounded' onClick={() => { handleFriendRequest(friend?.id) }}>
                        <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                      </button>
                    </div>

                  </div>))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {edit && <EditProfile />}
    </>
  )
}

export { Home };