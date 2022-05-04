$(()=>{

    const startingTime = $('#startingTime').text();
    const endingTime = $('#endingTime').text();
    const testName = $('#testName').text();
    const testSubject = $('#testSubject').text();
    const userId = $('#userId').text().trim();

    console.log(`/updatePerformance/${userId}`);

    const submitFunction = () => {
        const total = Number($('#totalQues').text());
        console.log(total);

        let correct = 0;

        for(let i=0 ; i<total ; i++){
            console.log($('input[name="exampleRadios'+i+'"]:checked').val());
            if(Number($('input[name="exampleRadios'+i+'"]:checked').val()) === Number($('#ans'+i).text())){
                correct++;
                $('#questionNo'+i).addClass('correct');
            }
            else{
                $('#questionNo'+i).addClass('wrong');
            }
        }

        $('#result').html('<h1> Result </h1>' +
            '<h2>' + correct +' correct out of ' + total + ' Questions!</h2>');

        $.post(`/api/updatePerformance/${userId}` , {
            testName: testName,
            testSubject: testSubject,
            score: correct,
            totalQuestions: total
        })
        .then(user => {
            console.log(user);
            window.location = '/profile';
        })
        .catch(err => {
            console.log("Error updating Results");
            console.log(err);
        });
    }
    
   $('#submitBtn').click(e=>{
       e.preventDefault();
       submitFunction();
   });

   setInterval(() => {
       if(Date.now() >= new Date(endingTime)) {
           console.log('Ended');  
           submitFunction();
       }
   }, 500);

});