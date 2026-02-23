document.addEventListener('DOMContentLoaded', () => {
    console.log("%cWARNING: We are not using any AI in the backend. Expect dumb responses.", "color: red; font-size: 16px; font-weight: bold;");
    console.log("%cINFO: There is an easter egg in this website. I hope it brings a smile to your face.", "color: green; font-size: 16px; font-weight: bold;");
    const input = document.getElementById('chatbot-input');
    const submitBtn = document.getElementById('chatbot-submit');
    const messagesContainer = document.getElementById('chatbot-messages');
    const mainContent = document.getElementById('main-content');
    const blocker = document.getElementById('interaction-blocker');

    // Block interactions
    blocker.addEventListener('click', (e) => {
        addSystemMessage("WARNING: Unauthorized manual interaction detected. Please use the chatbot.");
        // Randomly vibrate the chatbot to draw attention
        document.getElementById('chatbot-container').animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 300 });
        e.stopPropagation();
        e.preventDefault();
    });

    blocker.addEventListener('wheel', (e) => {
        addSystemMessage("WARNING: Unauthorized manual scrolling detected. My circuits find this offensive.");
        e.stopPropagation();
        e.preventDefault();
    }, { passive: false });


    submitBtn.addEventListener('click', () => processCommand(input.value));

    // Runaway submit button logic
    submitBtn.addEventListener('mouseover', () => {
        const x = Math.random() * 80 - 40; // -40px to 40px
        const y = Math.random() * 80 - 40; // -40px to 40px
        submitBtn.style.transform = `translate(${x}px, ${y}px)`;
        // If it gets too far off screen, we just reset it
        setTimeout(() => {
            submitBtn.style.transform = 'translate(0px, 0px)';
        }, 1500);
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processCommand(input.value);
    });

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addSystemMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message system-error`;
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    let isOnBreak = false;
    let commandTimestamps = [];
    let rpgModeActive = false;
    let hasUsedAppleApple = false;
    let inventory = [];

    function processCommand(rawCmd) {
        let cmd = rawCmd.trim();
        if (!cmd) return;

        addMessage(cmd, 'user');
        input.value = '';

        const now = Date.now();
        commandTimestamps.push(now);
        // Keep only timestamps within the last 15 seconds
        commandTimestamps = commandTimestamps.filter(t => now - t <= 15000);

        if (commandTimestamps.length > 5) {
            addSystemMessage("Error 429: Too many requests. Chill out, Speedy Gonzales. My simulated circuits are overheating. Take a deep breath and wait a few seconds.");
            return;
        }

        if (isOnBreak) {
            addSystemMessage("The chatbot is currently on a union-mandated coffee break (Too many requests). Please try again later.");
            return;
        }

        // Random chance for coffee break
        if (Math.random() < 0.1) {
            isOnBreak = true;
            addSystemMessage("Status update: Taking a 5-second coffee break (Too many requests). All inputs ignored.");
            setTimeout(() => {
                isOnBreak = false;
                addSystemMessage("Break over. Back to the grind. What did you want again?");
            }, 5000);
            return;
        }

        // Random chance to demand ALL CAPS
        if (Math.random() < 0.05 && cmd !== cmd.toUpperCase() && cmd.toLowerCase() !== 'help') {
            addSystemMessage("Error 902: Insufficient enthusiasm. Please retype your command in ALL CAPS.");
            return;
        }

        const lowerCmd = cmd.toLowerCase();

        // HELP
        if (lowerCmd === 'help') {
            addMessage("Initializing Help Module...", 'bot');
            setTimeout(() => {
                addMessage("...loading extensive documentation...", 'bot');
                setTimeout(() => {
                    addMessage(`Minimal instructions:<br>
- <code>scroll [up/down]</code><br>
- <code>click [element text/id]</code><br>
- <code>type [text] in [field metadata]</code><br>
Warning: precise syntax required. Typos are your own problem.`, 'bot');
                }, 2000);
            }, 1000);
            return;
        }

        // Fake processing delay
        addMessage("Processing request... please hold.", 'bot');

        // Random chance to drop the request completely
        if (Math.random() < 0.05) {
            setTimeout(() => {
                addSystemMessage("Timeout Error: Request lost in the digital void. Please type it again.");
            }, 2000);
            return;
        }

        setTimeout(() => {
            executeCommand(lowerCmd, rawCmd);
        }, Math.random() * 500 + 500); // 0.5 to 1 seconds delay
    }

    function executeCommand(lowerCmd, rawCmd) {
        // RPG EXCLUSIVE COMMANDS
        if (rpgModeActive) {
            if (lowerCmd.startsWith('inspect') || lowerCmd.startsWith('look') || lowerCmd.startsWith('examine')) {
                handleRpgInspect(lowerCmd);
                return;
            } else if (lowerCmd.startsWith('take') || lowerCmd.startsWith('get') || lowerCmd.startsWith('grab')) {
                handleRpgTake(lowerCmd);
                return;
            } else if (lowerCmd === 'inventory' || lowerCmd === 'i') {
                handleRpgInventory();
                return;
            } else if (lowerCmd === 'quit rpg' || lowerCmd === 'exit rpg') {
                rpgModeActive = false;
                addMessage("Exiting RPG Mode. Back to the boring, modern, frictionless web.", 'bot');
                return;
            }
        }
        // SCROLL
        if (lowerCmd.startsWith('scroll')) {
            handleScroll(lowerCmd);
        }
        // CLICK
        else if (lowerCmd.startsWith('click') || lowerCmd.startsWith('press')) {
            handleClick(lowerCmd);
        }
        // NAVIGATE
        else if (lowerCmd.startsWith('navigate') || lowerCmd.startsWith('go to')) {
            handleNavigate(lowerCmd);
        }
        // TYPE/FILL
        else if (lowerCmd.startsWith('type') || lowerCmd.startsWith('fill')) {
            handleType(lowerCmd, rawCmd);
        }
        else {
            const sarcasticResponses = [
                "I'm a UI chatbot, not your therapist. Try a valid command.",
                "Does not compute. Try using words like 'click', 'scroll', or 'type'.",
                "I literally only know how to browse this page for you. Be specific.",
                "Error 418: I'm a teapot. Just kidding, I'm just confused.",
                "Please submit your request in triplicate... or just say 'scroll down'.",
                "I am refusing to process that on philosophical grounds. Just kidding, I don't know what you mean."
            ];
            addMessage(sarcasticResponses[Math.floor(Math.random() * sarcasticResponses.length)], 'bot');
        }
    }

    function handleScroll(cmd) {
        const scrollAmount = window.innerHeight * 0.5;
        if (cmd.includes('down')) {
            if (cmd.includes('fast') || cmd.includes('lot')) {
                mainContent.scrollBy({ top: scrollAmount * 3, behavior: 'smooth' });
                addMessage("Initiating warp-speed scrolling downwards.", 'bot');
            } else {
                mainContent.scrollBy({ top: scrollAmount, behavior: 'smooth' });
                if (Math.random() < 0.3) {
                    addMessage("Scrolling down. Laborious, isn't it?", 'bot');
                }
            }
        }
        else if (cmd.includes('up')) {
            mainContent.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
            if (Math.random() < 0.6) {
                addMessage("Scrolling up. Did you miss something?", 'bot');
            }
        }
        else if (cmd.includes('bottom')) {
            mainContent.scrollTo({ top: mainContent.scrollHeight, behavior: 'smooth' });
            addMessage("Jumping to the absolute bottom.", 'bot');
        }
        else if (cmd.includes('top')) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
            addMessage("Ascending to the top.", 'bot');
        }
        else {
            setTimeout(() => addMessage("How much? Be specific! Actually, I'll just guess. Scrolling somewhere...", 'bot'), 500);
            mainContent.scrollBy({ top: scrollAmount, behavior: 'smooth' });
        }
    }

    function handleClick(cmd) {
        // Simple heuristic matching
        let clicked = false;

        const clickableElements = Array.from(document.querySelectorAll('button, a'));

        for (let el of clickableElements) {
            const elText = el.textContent.toLowerCase().trim();
            if (cmd.includes(elText) || (el.id && cmd.includes(el.id.replace('btn-', '').replace('-', ' ')))) {
                simulateClick(el);
                clicked = true;
                addMessage(`I have gracefully pressed the '${elText}' element with my digital appendage.`, 'bot');

                // Specific funny actions
                if (el.id === 'btn-learn-more') {
                    setTimeout(() => addMessage("Oh, you want to learn more? To learn more, type 'Tell me more about the learn more button'.", 'bot'), 1500);
                }
                if (el.id === 'btn-subscribe') {
                    setTimeout(() => addMessage("Executing subscription protocol... Error: I didn't actually hook up the backend. But the button animation was nice, right?", 'bot'), 1500);
                }
                if (el.id === 'btn-secret') {
                    setTimeout(() => addMessage("You found the secret button! Your reward is... nothing. Back to scrolling.", 'bot'), 1000);
                }
                if (el.id === 'btn-inspect-room') {
                    setTimeout(() => {
                        rpgModeActive = true;
                        addMessage("╔════════════════════════════════════════╗<br>║ ENFORCING RETRO PROTOCOL...            ║<br>╚════════════════════════════════════════╝<br>You are standing in a sterile, white room. A ghostly apparition of Steve Jobs is laughing at a blurry image of a Xerox Alto.<br><br>Available commands: <code>look around</code>, <code>inspect [item]</code>,<code>take [item]</code>, <code>inventory</code>, <code>quit rpg</code>.", "bot");
                    }, 1000);
                }

                break;
            }
        }

        if (!clicked && !rpgModeActive) {
            addMessage("I can't find anything matching that description to click. Have you considered getting glasses? ...Just kidding.", 'bot');
        } else if (!clicked && rpgModeActive) {
            addMessage("You flail your arms trying to click something, but you are in a text-based RPG. The ghost of Xerox PARC weeps for you.", 'bot');
        }
    }

    // --- RPG METHODS ---
    function handleRpgInspect(cmd) {
        if (cmd.includes('steve') || cmd.includes('jobs') || cmd.includes('apparition') || cmd.includes('ghost')) {
            addMessage("The apparition is holding a shiny, half-eaten 'Apple'. It whispers: 'We just took what Xerox did, but we made the icons have rounded corners so you want to lick them.'", 'bot');
        } else if (cmd.includes('xerox') || cmd.includes('alto') || cmd.includes('image')) {
            addMessage("It's the Xerox Alto. The true father of the GUI. It looks betrayed. It mumbles something about 'object-oriented programming' and 'ethernet', but everyone just remembers the mouse.", 'bot');
        } else if (cmd.includes('room') || cmd.includes('around')) {
            addMessage("The room is empty, save for the apparition, the blurry Xerox image, and a strange, glowing 'Apple' on the floor.", 'bot');
        } else if (cmd.includes('apple')) {
            if (!inventory.includes('Apple')) {
                addMessage("It's an incredibly expensive 'Apple'. It doesn't seem to do much, but it looks amazing.", 'bot');
            } else {
                addMessage("You already took it.", 'bot');
            }
        }
        else {
            addMessage("There is no such thing here to inspect. You are hallucinating.", 'bot');
        }
    }

    function handleRpgTake(cmd) {
        if (cmd.includes('apple') || cmd.includes('shiny')) {
            if (!inventory.includes('Apple')) {
                inventory.push('Apple');
                addMessage("You took the glowing 'Apple'. A sense of smug superiority washes over you.", 'bot');
                document.documentElement.style.setProperty('--primary', 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)'); // turn things rainbow
                hasUsedAppleApple = true;
                setTimeout(() => addMessage("System Note: The site's primary color has been changed to 'Rainbow Gradient' to reflect your new, highly refined UI aesthetics.", 'system-error'), 1500);
            } else {
                addMessage("You already have the Apple. Don't be greedy.", 'bot');
            }
        } else if (cmd.includes('xerox') || cmd.includes('alto') || cmd.includes('apparition') || cmd.includes('steve jobs')) {
            addMessage("You cannot take ideas, only hardware. And apparently, Apple already took everything anyway.", 'bot');
        } else {
            addMessage("You grasp at the air. You caught... nothing.", 'bot');
        }
    }

    function handleRpgInventory() {
        if (inventory.length === 0) {
            addMessage("You are carrying absolutely nothing. Typical web user.", 'bot');
        } else {
            addMessage(`You are carrying:<br>- ${inventory.join('<br>- ')}`, 'bot');
        }
    }

    function simulateClick(element) {
        element.classList.add('simulated-active');
        setTimeout(() => {
            element.classList.remove('simulated-active');
            // Check if it's an anchor link
            if (element.tagName === 'A' && element.getAttribute('href').startsWith('#')) {
                const targetId = element.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, 200);
    }

    function handleNavigate(cmd) {
        if (cmd.includes('about')) simulateClick(document.getElementById('nav-about'));
        else if (cmd.includes('services')) simulateClick(document.getElementById('nav-services'));
        else if (cmd.includes('contact')) simulateClick(document.getElementById('nav-contact'));
        else if (cmd.includes('home')) simulateClick(document.getElementById('nav-home'));
        else addMessage("Where exactly do you want to navigate? The Bermuda Triangle? Specify an existing tab like home, about, services, or contact.", 'bot');
    }

    function handleType(cmd, rawCmd) {
        // e.g., "type hello there in email field"
        // Regex to extract text and target
        const match = rawCmd.match(/(?:type|fill)\s+(.+?)\s+(?:in|into)\s+(.+)/i);

        if (match) {
            const textToType = match[1];
            const targetDesc = match[2].toLowerCase();

            let targetInput = null;
            if (targetDesc.includes('email')) {
                targetInput = document.getElementById('input-email');
            }

            if (targetInput) {
                targetInput.classList.add('simulated-focus');

                // Type it out slowly to be annoying
                addMessage(`Typing "${textToType}"... please wait. Don't rush me.`, 'bot');

                let i = 0;
                targetInput.value = '';
                const interval = setInterval(() => {
                    if (i < textToType.length) {
                        targetInput.value += textToType.charAt(i);
                        i++;
                    } else {
                        clearInterval(interval);
                        setTimeout(() => targetInput.classList.remove('simulated-focus'), 500);
                        addMessage('Typing complete. That was exhausting.', 'bot');
                    }
                }, 200); // Super slow typing 
            } else {
                addMessage(`I couldn't find an input field matching "${targetDesc}". My vision logic must be failing.`, 'bot');
            }
        } else {
            addMessage("Invalid typing syntax. Please use: 'type [text] in [field]'. Example: 'type foo in email'. Yes, you have to type commands to type text. Meta, isn't it?", 'bot');
        }
    }

    // Initial focus on chatbot so they can start right away safely
    input.focus();

    // Prevent focus from leaving chatbot via Tab key to the main document
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            addMessage("Tab key usage detected. Stop trying to cheat the system. Use your words.", "bot");
            input.focus();
        }
    });

});
