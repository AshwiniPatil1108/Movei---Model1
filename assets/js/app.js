const cl = console.log;

const movieContainer =document.getElementById('movieContainer');
const backDropId = document.getElementById('backDropId');
const movieModalId = document.getElementById('movieModalId');
const addMovieBtn = document.getElementById('addMovieBtn');
const movieCloseBtns =[...document.querySelectorAll('.movieClose')]
const movieForm=document.getElementById('movieForm');
const titleControl=document.getElementById('title');
const imageUrlControl=document.getElementById('imageUrl');
const ratingControl=document.getElementById('rating');
const contentControl=document.getElementById('content');
const movieSubmitBtn=document.getElementById('movieSubmitBtnId');
const movieUpdateBtn=document.getElementById('movieUpdateBtnId');

const BASE_URL =`https://movie-model-56337-default-rtdb.asia-southeast1.firebasedatabase.app`;

const POST_URL =`${BASE_URL}/posts.json`;

const sweetAlert = (msg, icon)=>{
   Swal.fire({
      title: msg,
      timer : 2500,
      icon : icon
   })
}



//3

const createMovieCards=(arr)=>{
   let result ='';

arr.forEach(movie =>{
    result += `
         <div class="col-md-4">
            <div class="card movieCard" id="${movie.id}">
               <figure class="m-0">
                  <img src="${movie.imageUrl}" alt="" title="">

                  <figcaption>
                     <h2 class="font-weight-bold">${movie.title}</h2>
                     <strong>Rating:${movie.rating}/5</strong>
                     <p class="content">
                        ${movie.body}
                     </p>
                     <div>
                        <button class="btn btn-sm nfx-btn bg-light" onclick="onEdit(this)">
                           Edit
                        </button>
                        <button class="btn btn-sm nfx-btn text-white" onclick="onDelete(this)">
                           Remove
                        </button>
                     </div>
                  </figcaption>
               </figure>
            </div>
         </div>
    `
    movieContainer.innerHTML =result;
})
}


//1
const makeApiCall = (methodName, apiurl, msgbody)=>{
   msgbody = msgbody ? JSON.stringify(msgbody):null

   //api cl >> loader show 
   loader.classList.remove("d-none");

   return fetch(apiurl, {
      method : methodName,
      body: msgbody,
      headers:{
         token :'get a JWT Token from Local storage'
      }
   })
   .then(res =>{
      return res.json()
   })
  
}
//2
makeApiCall("GET", POST_URL)
   .then(data => {
      //we are getting obj of obj as res
      cl(data)
      let postArr =[]
      for(const key in data){
         postArr.unshift({...data[key], id:key})
      }
      createMovieCards(postArr)
   })
   .catch(err=>{
      sweetAlert(err, "error")
   })
   .finally(()=>{
      loader.classList.add("d-none")
   })

//5
const toggleModalBackDrop=() =>{
   backDropId.classList.toggle('visible');
   movieModalId.classList.toggle('visible');
   movieUpdateBtn.classList.add('d-none');
   movieSubmitBtn.classList.remove('d-none');

   movieForm.reset();
}

//4.1
movieCloseBtns.forEach(btn=>{
   btn.addEventListener('click',toggleModalBackDrop);
  
})
//6

const onMovieAdd=(eve)=>{
   eve.preventDefault();
   let movieObj ={
      title: titleControl.value,
      imageUrl:imageUrlControl.value,
      body:contentControl.value,
      rating:ratingControl.value,
      
   }

   cl(movieObj);
   //api call  to add new movei

   makeApiCall("POST", POST_URL, movieObj)
      .then(res=>{
         cl(res)//api cl success
         //create new card in ui
         movieObj.id = res.name
         let card =document.createElement('div');
         card.className ='col-md-4';
      
         card.innerHTML =
               `
                        <div class="card movieCard" id="${movieObj.id}">
                           <figure class="m-0">
                              <img src="${movieObj.imageUrl}" alt="" title="">

                              <figcaption>
                                 <h2 class="font-weight-bold">${movieObj.title}</h2>
                                 <strong>Rating:${movieObj.rating}/5</strong>
                                 <p class="content">
                                    ${movieObj.body}
                                 </p>
                                 <div>
                                    <button class="btn btn-sm nfx-btn bg-light" onclick="onEdit(this)">
                                       Edit
                                    </button>
                                    <button class="btn btn-sm nfx-btn text-white" onclick="onDelete(this)">
                                       Remove
                                    </button>
                                 </div>
                              </figcaption>
                           </figure>
                        </div>
               `
               movieContainer.prepend(card)
               sweetAlert("MOVIE ADDED SUCCESSFULLYY!!","success")
      })
      .catch(err =>sweetAlert(err, 'error'))
      .finally(()=>{
         loader.classList.add("d-none")
         movieForm.reset()
      })




}

//7

const onEdit = (ele)=>{
   toggleModalBackDrop();
   let EDIT_ID = ele.closest('.card').id;
   localStorage.setItem("editId", EDIT_ID)
   cl(EDIT_ID)

   //EDIT_URL 
   let EDIT_URL =`${BASE_URL}/posts/${EDIT_ID}.json`;
   //api call to get single object

   makeApiCall("GET", EDIT_URL)
      .then(res=>{
         cl(res)
         titleControl.value = res.title;
         contentControl.value = res.body;
         imageUrlControl.value = res.imageUrl;
         ratingControl.value =res.rating;

         movieUpdateBtn.classList.remove('d-none');
         movieSubmitBtn.classList.add('d-none');
      })
      .catch(err=>{
         sweetAlert(err, "error")
      })
      .finally(()=>{
         loader.classList.add("d-none")
      })
}


const onMovieUpdate =()=>{
   let UPDATED_ID = localStorage.getItem('editId')
   let UPDATED_OBJ = {
      title:titleControl.value,
      imageUrl:imageUrlControl.value,
      body:contentControl.value,
      rating:ratingControl.value,
     
   }

   let UPDATED_URL =`${BASE_URL}/posts/${UPDATED_ID}.json`
   makeApiCall("PATCH", UPDATED_URL, UPDATED_OBJ)
   .then(res=>{
      cl(res)
      let card = document.getElementById(UPDATED_ID);
      cl(card)
      card.innerHTML=`
                           <figure class="m-0">
                              <img src="${res.imageUrl}" alt="" title="">

                              <figcaption>
                                 <h2 class="font-weight-bold">${res.title}</h2>
                                 <strong>Rating:${res.rating}/5</strong>
                                 <p class="content">
                                    ${res.body}
                                 </p>
                                 <div>
                                    <button class="btn btn-sm nfx-btn bg-light" onclick="onEdit(this)">
                                       Edit
                                    </button>
                                    <button class="btn btn-sm nfx-btn text-white" onclick="onDelete(this)">
                                       Remove
                                    </button>
                                 </div>
                              </figcaption>
                           </figure>
      
      
      `
     
       toggleModalBackDrop();
       sweetAlert("MOVIE UPDATED SUCCESSFULLYY!!","success")
   })
   .catch(err=>{
      sweetAlert(err, "error")
   })
   .finally(()=>{
      loader.classList.add("d-none")
   })
      


}



const onDelete = (ele) =>{

   Swal.fire({
       title: "Are you sure?",
       text: "You won't to removed this post!",
       icon: "warning",
       showCancelButton: true,
       confirmButtonColor: "#3085d6",
       cancelButtonColor: "#d33",
       confirmButtonText: "Yes, remove it!"
     }).then((result) => {
       if (result.isConfirmed) {
           //removeId
           let removeId = ele.closest(`.card`).id;

           //removeURL

           let REMOVE_URL = `${BASE_URL}/posts/${removeId}.json`
           //API call
           makeApiCall("DELETE", REMOVE_URL)
           .then(res =>{
               ele.closest(`.card`).parentElement.remove();
               sweetAlert("MOVIE REMOVE SUCCESSFULLYY !!!","success");
           })
           .catch(err =>{
            sweetAlert(err,"error")
           })
           .finally(()=>{
            loader.classList.add('d-none')
        })

       }
     });
}







addMovieBtn.addEventListener('click',toggleModalBackDrop);//4
movieForm.addEventListener('submit',onMovieAdd);
movieUpdateBtn.addEventListener('click',onMovieUpdate);