document.addEventListener('DOMContentLoaded',()=>{
    console.log("all the content has been loaded");
    const addRapper = document.querySelector('#add_rapper');
    var countryNames=[];
    const countries = document.querySelector('#countries');
    const addRapperForm = document.querySelector('#add_rapper_form');

    fetch("https://restcountries.eu/rest/v2/all")
        .then(response => response.json())
        .then(result => {
            countryNames = result;
           // console.log(countryNames);
        })
        .catch(error => console.log( error));

    addRapperForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        console.log(addRapperForm.rapper_name.value);
        dataBase.collection('rappers').add({
            name:addRapperForm.rapper_name.value,
            country:addRapperForm.countries.value,
            description:addRapperForm.description.value,
            votes:0
        });
        addRapperForm.rapper_name.value = '';
        addRapperForm.countries.value = '';
        addRapperForm.description.value = '';
        

    })

    addRapper.addEventListener('click',()=>{
        countryNames.forEach(country=>{
            const option = document.createElement('option');
            option.textContent = country.name;
            option.value = country.name;
            countries.appendChild(option);
        })
       // console.log(countries);
    });

    const renderCountries = (country)=>{
        const countryName = document.createElement('span');
        const option = document.createElement('option');
        countryName.textContent = country.name;
        countryName.value = country.name;
        option.append(countryName);
        countries.append(option);
    }

    const rapperList = document.querySelector('#rapperList') ;
    const renderList = (doc)=>{
        const card = document.createElement('div');
        const name = document.createElement('span');
        const country = document.createElement('span');
        const votes = document.createElement('span');
        const description = document.createElement('p');
        const divHeader = document.createElement('div');
        const divBody = document.createElement('div');
        const brakeLine = document.createElement('br');
        const cardReveal = document.createElement('div');
        const revealContent = document.createElement('p');
        const revealTitle = document.createElement('span');
        const closeIcon = document.createElement('i');
        const heartIcon = document.createElement('i');
        const separator = document.createElement('p');

        name.textContent = doc.data().name;
        votes.textContent = doc.data().votes;
        country.textContent = doc.data().country;
        description.textContent = doc.data().description;
        revealTitle.textContent = doc.data().name;
        closeIcon.innerHTML = `<i class="material-icons tiny right">close</i>`
        heartIcon.innerHTML = `<i id="add_vote" class="material-icons tiny  prefix">star_rate</i>`
        separator.value ="  :  ";

        divHeader.appendChild(name);
        divBody.appendChild(country);
        divBody.appendChild(brakeLine);
        divBody.appendChild(votes);
        divBody.appendChild(separator);
        divBody.appendChild(heartIcon);
        revealContent.appendChild(description);
        revealTitle.appendChild(closeIcon);
        cardReveal.appendChild(revealTitle);
        cardReveal.appendChild(revealContent);

        card.appendChild(divHeader);
        card.appendChild(divBody);
        card.appendChild(cardReveal);

        divHeader.setAttribute('class','card-title ');
        name.setAttribute('class','activator');
        divBody.setAttribute('class','card-content');


        rapperList.appendChild(card);
        card.setAttribute('class', 'card col l4 s12');
        cardReveal.setAttribute('class', 'card-reveal');
        revealTitle.setAttribute('class', 'card-title');

        const addVote = document.querySelector('#add_vote');
        addVote.addEventListener('click',(e)=>{
            e.preventDefault();
            var x = doc.data().votes;
            x++;
            heartIcon.setAttribute('class','material-icons tiny  prefix blue-text');
            dataBase.collection('rappers').doc(doc.id).update({
                votes:x
            });
        })
    }
    dataBase.collection('rappers').onSnapshot(dbSnap=>{
        let dbChange = dbSnap.docChanges();
        dbChange.forEach(change =>{
            if(change.type=='added'){
                renderList(change.doc);
            }
        });
    });

    const signUpForm = document.querySelector('#sign_up_form');
    const signInForm = document.querySelector('#sign_in_form');
    const signOut = document.querySelector('#sign_out');
    signUpForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const email = signUpForm.sign_up_email.value;
        const password = signUpForm.sign_up_password.value;
        auth.createUserWithEmailAndPassword(email, password)
        .then(cred=>{
            console.log(cred);
        })
        .catch(err=>{
           // err.message;
        })
    });
    signInForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const email = signInForm.sign_in_email.value;
        const password = signInForm.sign_in_password.value;
        auth.signInWithEmailAndPassword(email, password)
        .then(cred=>{
           // console.log(cred);
        })
        .catch(err=>{
            err.message;
        })
    });
    
    signOut.addEventListener('click',(e)=>{
        e.preventDefault();
        auth.signOut();
    });
    const signedInUI = document.querySelectorAll('.signed_in');
    const notSignedInUI = document.querySelectorAll('.not_signed_in');
    auth.onAuthStateChanged(user=>{
        if(user){
            signedInUI.forEach(item=>{
                item.style.display = "block";
            });
            notSignedInUI.forEach(item=>{
                item.style.display = "none";
            });

        }else {
            signedInUI.forEach(item=>{
                item.style.display = "none";
            });
            notSignedInUI.forEach(item=>{
                item.style.display = "block";
            });
        }
    });
});

