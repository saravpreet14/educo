$(()=>{
    const quesArea = $('#quesarea');
    const addQues = $('#addques');
    const doneBtn = $('#done');
    const submit = $('#submit');



    addQues.click(()=>{
        submit.removeClass("hideKardo");
        doneBtn.addClass("hideKardo");
        addQues.addClass("hideKardo");
        quesArea.html('<div class="mt-3">' + 
        '<h1>Question:</h1>\n' +
            '<div class="form-group">\n' +
            '    <textarea class = "col-sm-12" id="Ques" name="ques" rows="3" placeholder="What is the question ?"></textarea>\n' +
            '    </div>\n' +
            '    <div class="form-group">\n' +
            '    <input name = "op1" type="text" id="option1" class="form-control" placeholder="Enter option 1">\n' +
            '    </div>\n' +
            '    <div class="form-group">\n' +
            '    <input name = "op2" type="text" id="option2" class=" form-control" placeholder="Enter option 2">\n' +
            '    </div>\n' +
            '    <div class="form-group">\n' +
            '    <input name="op3" type="text" id="option3" class="form-control" placeholder="Enter option 3">\n' +
            '    </div>\n' +
            '    <div class="form-group">\n' +
            '    <input name = "op4" type="text" id="option4" class=" form-control" placeholder="Enter option 4">\n' +
            '    </div>\n' +
            '    <div class="form-group">\n' +
            '    <input name = "ans" type="text" id="ans" class="form-control" placeholder="Answer">\n' +
            '    </div>' +
        '</div>');
    });

    let questions = [];

    submit.click(()=>{

        submit.addClass("hideKardo");
        doneBtn.removeClass("hideKardo");
        addQues.removeClass("hideKardo");
        let ques = $('#Ques');
        let ans = $('#ans');

        if(ques.val() != ''){
            let optArray = [];
            optArray.push($("#option1").val());
            optArray.push($("#option2").val());
            optArray.push($("#option3").val());
            optArray.push($("#option4").val());

            console.log("Options");
            console.log(optArray);



            let qobj = {
                question: ques.val(),
                options: optArray,
                answer: Number(ans.val())
            };

            console.log(qobj);

            questions.push(qobj);
            console.log("Questions");
            console.log(questions.length);
        }
    })

    doneBtn.click(()=>{
        $.post('/test', {
            name: $('#testname').val(),
            subject: $('#subject').val(),
            createdBy: $('#user').text(),
            startingTime: $('#startTime').val(),
            endingTime: $('#endTime').val(),
            content: questions
        })
            .then((obj)=>{
                console.log('Object');
                console.log(obj);
                window.location = obj;
            })
            .catch((err)=>{
                console.log(err);
            })
    })

});

