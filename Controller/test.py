import pywhatkit as kit
import pyautogui
import time

# Replace with your phone number and message
phone_number = "+962796372310"  # Use your actual phone number with country code
message = "Hello from PyWhatKit!"

# Open WhatsApp Web chat for the specified phone number
kit.sendwhatmsg_instantly(phone_number, '', 10, tab_close=False)

# Wait for WhatsApp Web to load
time.sleep(15)  # Wait longer to ensure everything is loaded

# Type the message
pyautogui.write(message)

# Wait a moment to ensure the message is fully typed
time.sleep(1)

# Press Enter to send the message
pyautogui.press('enter')

# Wait for a short moment to confirm sending
time.sleep(2)

print("Message sent.")
