import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NoProfile } from '../assets'

function FriendsCard({ friends }) {

  const [friendi, setFriendiRequest] = useState([]);

  // useEffect(() => {
  //   const tryonce = friends.forEach(async (id) => {
  //     const new_q = doc(dbStore, "users", id);
  //     const docSnap = await getDoc(new_q);

  //     if (docSnap.exists()) {
  //       // console.log(friendi.length, "asdfghjkl3");
  //       // friendi.push({
  //       //     userId: docSnap.id,
  //       //     name: docSnap.data().name,
  //       //     email: docSnap.data().email,
  //       //     views: docSnap.data().views,
  //       //     verified: docSnap.data().verified,
  //       //     createdAt: docSnap.data().createdAt,
  //       //     profession: docSnap.data().profession,
  //       //     location: docSnap.data().location,
  //       //     profileUrl: docSnap.data().profileUrl
  //       // });
  //       return {
  //         userId: docSnap.id,
  //         name: docSnap.data().name,
  //         email: docSnap.data().email,
  //         views: docSnap.data().views,
  //         verified: docSnap.data().verified,
  //         createdAt: docSnap.data().createdAt,
  //         profession: docSnap.data().profession,
  //         location: docSnap.data().location,
  //         profileUrl: docSnap.data().profileUrl
  //       };
  //     }
  //   });
  //   setFriendiRequest(setFriendiRequest);
  // }, [friends]);


  return (
    <div>
      <div className='w-full bg-primary  shadow-sm rounded-lg px-6 py-5'>
        <div className="flex item-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]">
          <span>Friends</span>
          <span>{friends?.length}</span>
        </div>
        <div className='w-full flex flex-col gap-4 pt-4'>
          {
            friends?.map((friend) => (
              <Link to={"/profile/" + friend?.userId} key={friend?.userId} className='w-full flex gap-4 items-center cursor-pointer'>
                <img src={friend?.profileUrl === "" ? NoProfile : friend?.profileUrl ?? NoProfile} className='w-10 h-10 object-cover rounded-full' alt={friend?.firstname} />
                <div className='flex-1'>
                  <p className='text-base font-medium text-ascent-1'>
                    {friend?.name}
                  </p>
                  <span className='text-sm text-ascent-2'>
                    {friend?.profession === "" ? "No profession" : friend?.profession ?? "No profession"}
                  </span>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export { FriendsCard };
