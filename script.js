document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const submitButton = document.getElementById('submit');
  const previewImage = document.getElementById('preview');
  const resultContainer = document.getElementById('result');
  const doneButton = document.getElementById('done');
  const cameraBtn = document.getElementById('cameraBtn');
  const cameraStream = document.getElementById('cameraStream');

  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');

  const mainPage = document.getElementById('mainPage');
  const historyPage = document.getElementById('historyPage');
  const historyList = document.getElementById('historyList');
  const challengePage = document.getElementById('challengePage');
  const streakPage = document.getElementById('streakPage');
  const taskList = document.getElementById('taskList');
  const streakCountEl = document.getElementById('streakCount');

  const homeLink = document.getElementById('homeLink');
  const historyLink = document.getElementById('historyLink');
  const challengesLink = document.getElementById('challengesLink');
  const streakLink = document.getElementById('streakLink');

  const backHome = document.getElementById('backHome');
  const backHomeChallenge = document.getElementById('backHomeChallenge');
  const backHomeStreak = document.getElementById('backHomeStreak');

  const clearHistoryBtn = document.getElementById('clearHistory');
  const customNameInput = document.getElementById('customName');
  const customGoalInput = document.getElementById('customGoal');
  const addCustomBtn = document.getElementById('addCustomChallenge');

  // Sidebar toggle
  hamburger.addEventListener('click', () => {
    if(sidebar.classList.contains('active')){
      sidebar.style.right = '-250px';
      sidebar.classList.remove('active');
    } else {
      sidebar.style.right = '0';
      sidebar.classList.add('active');
    }
  });

  // Page navigation
  function showPage(page){
    mainPage.style.display='none';
    historyPage.style.display='none';
    challengePage.style.display='none';
    streakPage.style.display='none';
    page.style.display='block';
    sidebar.classList.remove('active');
    sidebar.style.right='-250px';
  }

  homeLink.addEventListener('click', () => showPage(mainPage));
  historyLink.addEventListener('click', () => {
    showPage(historyPage);
    renderHistory();
  });
  challengesLink.addEventListener('click', () => { showPage(challengePage); renderTasks(); });
  streakLink.addEventListener('click', () => { showPage(streakPage); updateStreak(); });

  backHome.addEventListener('click', () => showPage(mainPage));
  backHomeChallenge.addEventListener('click', () => showPage(mainPage));
  backHomeStreak.addEventListener('click', () => showPage(mainPage));

  // File preview
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = e => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        resultContainer.textContent = '';
      };
      reader.readAsDataURL(file);
    }
  });

  // Classification
  submitButton.addEventListener('click', () => {
    if(!fileInput.files[0] && !previewImage.src){
      alert('Please select a file first!');
      return;
    }

    resultContainer.textContent='Analyzing...';
    setTimeout(()=>{
      const bins=['Recycling','Compost','Garbage'];
      const randomBin=bins[Math.floor(Math.random()*bins.length)];
      resultContainer.innerHTML=`This item belongs in: <strong>${randomBin}</strong>`;
      doneButton.style.display='inline-block';
      submitButton.style.display='none';

      previewImage.style.display='block';
      const imageData = previewImage.src;

      let history = JSON.parse(localStorage.getItem('ecoHistory'))||[];
      history.push({ file:imageData, category:randomBin, date:new Date().toLocaleDateString() });
      localStorage.setItem('ecoHistory', JSON.stringify(history));

      updateStreak();
      autoCompleteChallenges(randomBin);
      renderTasks();
    },1000);
  });

  // Done button
  doneButton.addEventListener('click', ()=>{
    fileInput.value='';
    previewImage.src='';
    previewImage.style.display='none';
    resultContainer.textContent='';
    doneButton.style.display='none';
    submitButton.style.display='inline-block';
  });

  // Camera capture
  cameraBtn.addEventListener('click', ()=>{
    navigator.mediaDevices.getUserMedia({video:true})
    .then(stream=>{
      cameraStream.srcObject=stream;
      cameraStream.style.display='block';
      setTimeout(()=>{
        const canvas=document.createElement('canvas');
        canvas.width=cameraStream.videoWidth;
        canvas.height=cameraStream.videoHeight;
        canvas.getContext('2d').drawImage(cameraStream,0,0);
        previewImage.src=canvas.toDataURL('image/png');
        cameraStream.srcObject.getTracks().forEach(track=>track.stop());
        cameraStream.style.display='none';
        submitButton.click();
      },3000);
    }).catch(err=>alert('Camera access denied or unavailable'));
  });

  // Default & custom tasks
  let tasks=[
    {name:'Recycle 3 items today', completed:false, type:'recycle', goal:3, progress:0},
    {name:'Compost 1 item', completed:false, type:'compost', goal:1, progress:0},
    {name:'Use reusable bag', completed:false, type:'bag', goal:1, progress:0}
  ];

  function renderTasks(){
    taskList.innerHTML='';
    const customTasks = JSON.parse(localStorage.getItem('ecoCustomTasks'))||[];
    [...tasks,...customTasks].forEach((task,i)=>{
      const div=document.createElement('div');
      div.className='task';
      div.innerHTML=`<span>${task.name} (${task.progress}/${task.goal})</span><button>${task.completed?'✔':'Mark'}</button>`;
      const btn=div.querySelector('button');
      btn.addEventListener('click',()=>{
        task.completed=true;
        btn.textContent='✔';
        task.progress = task.goal;
        saveCustomTasks();
        renderTasks();
      });
      taskList.appendChild(div);
    });
  }

  function autoCompleteChallenges(category){
    tasks.forEach(task=>{
      if(task.type==='recycle' && category==='Recycling'){ task.progress++; }
      if(task.type==='compost' && category==='Compost'){ task.progress++; }
      if(task.progress>=task.goal){ task.completed=true; }
    });
    saveCustomTasks();
  }

  function saveCustomTasks(){
    const customTasks = JSON.parse(localStorage.getItem('ecoCustomTasks'))||[];
    localStorage.setItem('ecoCustomTasks', JSON.stringify(customTasks));
  }

  addCustomBtn.addEventListener('click',()=>{
    const name = customNameInput.value.trim();
    const goal = parseInt(customGoalInput.value);
    if(name && goal>0){
      const customTasks = JSON.parse(localStorage.getItem('ecoCustomTasks'))||[];
      customTasks.push({name:name, completed:false, goal:goal, progress:0});
      localStorage.setItem('ecoCustomTasks', JSON.stringify(customTasks));
      customNameInput.value=''; customGoalInput.value='';
      renderTasks();
    }
  });

  // Streak
  function updateStreak(){
    let streakData=JSON.parse(localStorage.getItem('ecoStreak'))||{count:0,lastDate:null};
    const today=new Date().toDateString();
    if(streakData.lastDate!==today){
      const yesterday=new Date(); yesterday.setDate(yesterday.getDate()-1);
      if(streakData.lastDate===yesterday.toDateString()){ streakData.count++; }
      else{ streakData.count=1; }
      streakData.lastDate=today;
      localStorage.setItem('ecoStreak',JSON.stringify(streakData));
    }
    streakCountEl.textContent=streakData.count;
  }

  // History
  function renderHistory(){
    const history = JSON.parse(localStorage.getItem('ecoHistory'))||[];
    historyList.innerHTML=history.map(item=>`
      <div class="historyItem">
        <img src="${item.file}" alt="Thumbnail">
        <span>${item.category} - ${item.date}</span>
      </div>
    `).join('');
  }

  clearHistoryBtn.addEventListener('click',()=>{
    if(confirm('Are you sure you want to delete all history?')){
      localStorage.removeItem('ecoHistory');
      renderHistory();
    }
  });

});
