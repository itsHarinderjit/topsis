function readFileData(e) {
    const text = e.target.result;
    // document.write(text);
    console.log(text)
 }

function fileHandle(event) {
    // file = event.target.files[0]
    let inputFile = document.getElementById('inputFile')
    file = inputFile.file
    console.log(file)
    // const reader = new FileReader()
    // reader.addEventListener('load',readFileData)
    // reader.readAsText(file);

    let formData = new FormData();
      formData.set('file', file);

      axios.post("http://localhost:3000/", formData, {
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`upload process: ${percentCompleted}%`);
        }
      })
        .then(res => {
          console.log(res.data)
          console.log(res.data.url)
        })

}


let fileInput = document.getElementById('subBtn')
fileInput.addEventListener('click',fileHandle)

// jQuery
// $(document).ready(function () {
			
//     $('#subBtn').click(function(){

//        let inputfile = $('#inputFile').val()
//        let inputWeights = $('#inputWeights').val()
//        let inputImpacts = $('#inputImpacts').val()
//        let inputEmail = $('#inputEmail').val()
//        $.post('',   // url
//         //   { myData: 'This is my data.' }, // data to be submit
//             { file: inputfile,
//             weights: inputWeights,
//             impacts: inputImpacts,
//             email: inputEmail },
//           function(data, status, jqXHR) {// success callback
//                    $('p').append('status: ' + status + ', data: ' + data);
//            });
//        });
// });