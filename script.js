// script.js
let chats = [
    { id: 1, name: "Sarah Ahmed", avatar: "👩‍💼", lastMsg: "See you at 8pm? 😊", time: "11:42", unread: 2, online: true, messages: [
        { from: "them", text: "Hey, are we still meeting today?", time: "11:20" },
        { from: "me", text: "Yes definitely!", time: "11:25" }
    ]},
    { id: 2, name: "Ahmed Khan", avatar: "👨‍💻", lastMsg: "Project update attached", time: "10:15", unread: 0, online: false, messages: [
        { from: "them", text: "Can you review the new design?", time: "09:50" }
    ]},
    { id: 3, name: "Family Group", avatar: "👨‍👩‍👧", lastMsg: "Mom: Dinner at 7?", time: "09:05", unread: 4, online: true, messages: []},
    { id: 4, name: "Elena Petrova", avatar: "🇷🇺", lastMsg: "Voice message (0:12)", time: "Yesterday", unread: 1, online: false, messages: []}
];

let currentChatId = null;
let allMessages = {}; // key = chatId

$(document).ready(function () {
    console.log('%c📱 WhatsApp Web Clone – Fully functional by SAMER SAEID', 'color:#25D366; font-weight:bold');
    
    renderChatList();
    
    // Fake incoming message every 25 seconds
    setInterval(() => {
        if (currentChatId) {
            const chat = chats.find(c => c.id === currentChatId);
            if (chat) {
                const fakeMsg = { from: "them", text: "Just checking in 👋", time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) };
                if (!allMessages[currentChatId]) allMessages[currentChatId] = [];
                allMessages[currentChatId].push(fakeMsg);
                renderMessages();
            }
        }
    }, 25000);
});

function renderChatList(filtered = chats) {
    const container = $('#chatList');
    let html = '';
    filtered.forEach(chat => {
        html += `
        <div onclick="openChat(${chat.id})" class="list-group-item list-group-item-action d-flex align-items-center ${currentChatId === chat.id ? 'active' : ''}">
            <div class="me-3 fs-3">${chat.avatar}</div>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between">
                    <strong>${chat.name}</strong>
                    <small class="text-muted">${chat.time}</small>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-truncate text-muted" style="max-width:190px">${chat.lastMsg}</span>
                    ${chat.unread > 0 ? `<span class="badge bg-success rounded-pill">${chat.unread}</span>` : ''}
                </div>
            </div>
        </div>`;
    });
    container.html(html || '<div class="text-center py-5 text-muted">No chats found</div>');
}

function filterChats() {
    const term = $('#searchInput').val().toLowerCase().trim();
    const filtered = chats.filter(c => c.name.toLowerCase().includes(term));
    renderChatList(filtered);
}

function openChat(id) {
    currentChatId = id;
    const chat = chats.find(c => c.id === id);
    if (!chat) return;
    
    // Mobile: close sidebar
    if (window.innerWidth < 992) toggleSidebar();
    
    $('#chatName').text(chat.name);
    $('#chatAvatar').html(chat.avatar);
    $('#chatStatus').text(chat.online ? 'online' : 'last seen recently');
    
    // Load or create messages
    if (!allMessages[id]) allMessages[id] = chat.messages || [];
    
    renderMessages();
    renderChatList();
}

function renderMessages() {
    const container = $('#messagesContainer');
    let html = '';
    
    const msgs = allMessages[currentChatId] || [];
    msgs.forEach(msg => {
        const isSent = msg.from === 'me';
        html += `
        <div class="d-flex ${isSent ? 'justify-content-end' : 'justify-content-start'}">
            <div class="message ${isSent ? 'message-sent' : 'message-received'}">
                ${msg.text}
                <span class="timestamp">${msg.time} ${isSent ? '<i class="bi bi-check2-all text-success"></i>' : ''}</span>
            </div>
        </div>`;
    });
    
    container.html(html);
    container[0].scrollTop = container[0].scrollHeight;
}

function sendMessage() {
    const input = $('#messageInput');
    const text = input.val().trim();
    if (!text || !currentChatId) return;
    
    const now = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    
    if (!allMessages[currentChatId]) allMessages[currentChatId] = [];
    allMessages[currentChatId].push({ from: "me", text: text, time: now });
    
    // Update last message in chat list
    const chat = chats.find(c => c.id === currentChatId);
    if (chat) chat.lastMsg = text.length > 30 ? text.substring(0, 27) + '...' : text;
    chat.time = now;
    
    renderMessages();
    renderChatList();
    input.val('');
    
    // Simulate reply after 1.8s
    setTimeout(() => {
        if (currentChatId) {
            const replies = ["Got it 👍", "Haha exactly!", "See you soon!", "Thanks! ❤️"];
            const replyText = replies[Math.floor(Math.random() * replies.length)];
            const replyTime = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
            allMessages[currentChatId].push({ from: "them", text: replyText, time: replyTime });
            renderMessages();
            
            const chat = chats.find(c => c.id === currentChatId);
            if (chat) chat.lastMsg = replyText;
            renderChatList();
        }
    }, 1800);
}

function toggleSidebar() {
    $('#sidebar').toggleClass('show');
}

function newChat() {
    const name = prompt("Enter contact name to start new chat:", "New Friend");
    if (!name) return;
    const newChatObj = {
        id: Date.now(),
        name: name,
        avatar: "👤",
        lastMsg: "Say hi 👋",
        time: "now",
        unread: 0,
        online: true,
        messages: []
    };
    chats.unshift(newChatObj);
    renderChatList();
    openChat(newChatObj.id);
}

function startCall() {
    alert("📞 Voice call started with " + (currentChatId ? chats.find(c => c.id === currentChatId).name : "contact") + "\n(Real-time audio demo)");
}

function startVideoCall() {
    alert("📹 Video call started!\n(Camera preview would appear here in full app)");
}

function showMoreMenu() {
    alert("📋 More options:\n• View contact info\n• Search in chat\n• Clear chat\n• Block");
}

function showProfile() {
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

function logoutDemo() {
    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
    alert("✅ Logged out from this browser.\nAll data is local-only.");
}

function showEmojiPicker() {
    const picker = $('#emojiPicker');
    if (picker.hasClass('d-none')) {
        picker.removeClass('d-none');
        // Simple emoji grid
        const emojis = "😀😃😄😁😆😅😂🤣🥲🥹😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥸🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🤗🤔🤭🤫🤥😶😐😑😬🙄😯😦😧😮😲🥱😴🤤😪😵🤐🥴🤢🤮🤧😷🤒🤕🤑🤠😈👿👹👺🤡💩👻💀☠️👽👾🤖🎃😺".split('');
        let html = '';
        emojis.forEach(e => html += `<span onclick="insertEmoji('${e}')" class="fs-3 cursor-pointer p-2">${e}</span>`);
        picker.html(html);
    } else {
        picker.addClass('d-none');
    }
}

function insertEmoji(emoji) {
    const input = document.getElementById('messageInput');
    input.value += emoji;
    $('#emojiPicker').addClass('d-none');
    input.focus();
}

function attachFile() {
    alert("📎 File attached!\n(Photo / Document would be sent in full WhatsApp Web)");
}

function recordVoice() {
    alert("🎤 Voice note recording started...\n(0:00)\nRelease to send voice message");
    // Simulate sending voice note after 2 seconds
    setTimeout(() => {
        if (currentChatId) {
            const now = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
            if (!allMessages[currentChatId]) allMessages[currentChatId] = [];
            allMessages[currentChatId].push({ from: "me", text: "🎤 Voice message (0:12)", time: now });
            renderMessages();
            
            const chat = chats.find(c => c.id === currentChatId);
            if (chat) chat.lastMsg = "🎤 Voice message";
            renderChatList();
        }
    }, 2200);
}

function switchTab(tab) {
    // Simple tab switching for demo (Status / Calls / Communities)
    if (tab === 0) {
        alert("📨 Chats tab active (already on main screen)");
    } else if (tab === 1) {
        alert("⏰ Status tab\n(Your recent status updates would appear here)");
    } else if (tab === 2) {
        alert("📞 Calls tab\n(All your voice & video calls history)");
    } else if (tab === 3) {
        alert("👥 Communities tab\n(WhatsApp Communities feature demo)");
    }
}

// Global exposure
window.toggleSidebar = toggleSidebar;
window.openChat = openChat;
window.sendMessage = sendMessage;
window.newChat = newChat;
window.startCall = startCall;
window.startVideoCall = startVideoCall;
window.showMoreMenu = showMoreMenu;
window.showProfile = showProfile;
window.logoutDemo = logoutDemo;
window.showEmojiPicker = showEmojiPicker;
window.insertEmoji = insertEmoji;
window.attachFile = attachFile;
window.recordVoice = recordVoice;
window.switchTab = switchTab;
window.filterChats = filterChats;
