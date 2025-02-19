# 🚀 ReadTheory Auto Quiz Solver 🔥  

**Automate ReadTheory quizzes like an absolute legend.** This **Chrome extension** will grind quizzes **automatically**, using Google Gemini AI to attempt answers and spam submissions until it passes. **90 quizzes in 30 minutes? EZ.**  

## ⚠️ WARNING: YOU NEED TO ADD YOUR OWN GOOGLE GEMINI API KEYS ⚠️  
This **DOES NOT** come with working Gemini API keys. **If you’re whining about it not working "out of the box," that's on you.** Google **ratelimits keys**, so you need to generate your own.  

👉 **No keys = No answers.** If that’s an issue, go use another AI service or manually suffer through ReadTheory like a peasant.  

---

## 📌 Features  
✅ **Auto-fetches questions & answers** – No clicking needed.   
✅ **Uses multiple API keys** – Bypasses Gemini rate limits for **faster** quiz solving.  
✅ **Fails most quizzes like a 3rd grader** – But scrapes by enough to get **some** legit completions.  
✅ **Fully automated** – No need to manually click submit; just let it run.  
✅ **Lightweight & sneaky** – No unnecessary UI clutter, just raw quiz grinding.  

---

## 🛠 Installation  
### 1️⃣ Download the Repo  
Clone this **or download the ZIP**:  
```sh
git clone https://github.com/YOUR_USERNAME/ReadTheoryAutoQuiz.git
```
Extract it if you downloaded the ZIP.

### 2️⃣ Load the Extension in Chrome  
1. Go to `chrome://extensions/`  
2. Enable **Developer Mode** (top right corner)  
3. Click **"Load unpacked"**  
4. Select the folder you downloaded  

### 3️⃣ Add Your Google Gemini API Keys  
Inside `background.js`, **replace the `keys` array with your own API keys.**  
```javascript
let keys = [
    "YOUR_GEMINI_KEY_1",
    "YOUR_GEMINI_KEY_2",
    "YOUR_GEMINI_KEY_3",
    "YOUR_GEMINI_KEY_4"
];
```
👉 **Get keys from Google Cloud's Gemini API.** If you don’t know how, Google it. **If this step is too hard for you, this extension is NOT for you.**  

---

## ❓ FAQ  
### "It's not working!!!"  
🔹 **Did you add your API keys?** No? Do that first.  
🔹 **Did you reload the extension after adding keys?** Try again.  
🔹 **Still not working?** Check your **Google Cloud API quota.** Gemini **ratelimits accounts.**  
🔹 **Error messages?** Open `chrome://extensions/`, inspect the background script, and **read the logs.**  

### "Why does it fail most quizzes?"  
Because **Gemini AI is dumber than a bag of rocks** at multiple-choice quizzes. But **it passes just enough** to farm ReadTheory points.  

### "Can I use another AI instead of Gemini?"  
Yes. Modify `background.js` to use **GPT-4, Claude, or any other LLM API.** Just make sure it returns JSON-formatted answers.  

### "Will I get caught?"  
Probably not, but don’t be **an idiot** about it.  
- **Don’t grind 1000 quizzes in one day.**  
- **Spread out activity to look natural.**  
- **Maybe mix in a few manual answers so it’s not obvious.**  

---

## ⚡ Disclaimer  
This project is **for educational purposes only.** If you get banned, caught, or smacked upside the head by your teacher, **that’s on you.**  

Now go forth and **cheat responsibly.** 🏆🔥
