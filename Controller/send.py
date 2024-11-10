
import pywhatkit
import time
import os

# Function to read phone numbers from a text file
def read_phone_numbers(file_path):
    print(f"Reading phone numbers from {file_path}")
    if not os.path.exists(file_path):
        print(f"Phone numbers file {file_path} not found!")
        return []
    
    with open(file_path, 'r', encoding='utf-8') as file:
        phone_numbers = [line.strip() for line in file.readlines()]
    
    if not phone_numbers:
        print(f"No phone numbers found in {file_path}")
    
    return phone_numbers

# Function to read messages from a text file
def read_message(file_path):
    print(f"Reading message from {file_path}")
    if not os.path.exists(file_path):
        print(f"Message file {file_path} not found!")
        return ""
    
    with open(file_path, 'r', encoding='utf-8') as file:
        message = file.read().strip()
    
    if not message:
        print(f"No message found in {file_path}")
    
    return message

# Function to read image paths from a text file (or use a list of image paths)
def read_images(image_file):
    print(f"Reading image paths from {image_file}")
    if not os.path.exists(image_file):
        print(f"Image file {image_file} not found!")
        return []
    
    with open(image_file, 'r', encoding='utf-8') as file:
        image_paths = [line.strip() for line in file.readlines()]
    
    if not image_paths:
        print(f"No images found in {image_file}")
    
    return image_paths

# Main function to send WhatsApp messages with multiple images
def send_bulk_messages(phone_file, message_file, image_file=None):
    # Read the phone numbers, message, and image paths from files
    phone_numbers = read_phone_numbers(phone_file)
    message = read_message(message_file)
    image_paths = read_images(image_file) if image_file else []

    if not phone_numbers or not message:
        print("Missing phone numbers or message. Exiting.")
        return

    print(f"Starting to send messages to {len(phone_numbers)} contacts...")

    # Loop through each phone number and send the message
    for phone in phone_numbers:
        try:
            print(f"Sending message to {phone}...")
            
            # Send each image to the contact
            for image_path in image_paths:
                print(f"Sending image: {image_path}")
                pywhatkit.sendwhats_image(phone, image_path, message, 15, tab_close=True, close_time=3)
                time.sleep(5)  # Add a delay between sending images to avoid spamming
            
            # If no images, just send the text message
            if not image_paths:
                print(f"Sending message: {message}")
                pywhatkit.sendwhatmsg_instantly(phone, message, 10, tab_close=True, close_time=3)

        except Exception as e:
            print(f"Failed to send message to {phone}: {e}")

# Example usage:
phone_file = r"phone_numbers.txt"
message_file = r"message.txt"
image_file = r"images.txt"  # Text file containing paths to images, one image per line

send_bulk_messages(phone_file, message_file, image_file)
# import pywhatkit
# import time
# import os

# # Function to read phone numbers from a text file
# def read_phone_numbers(file_path):
#     print(f"Reading phone numbers from {file_path}")
#     if not os.path.exists(file_path):
#         print(f"Phone numbers file {file_path} not found!")
#         return []
    
#     with open(file_path, 'r', encoding='utf-8') as file:
#         phone_numbers = [line.strip() for line in file.readlines()]
    
#     if not phone_numbers:
#         print(f"No phone numbers found in {file_path}")
    
#     return phone_numbers

# # Function to read messages from a text file
# def read_message(file_path):
#     print(f"Reading message from {file_path}")
#     if not os.path.exists(file_path):
#         print(f"Message file {file_path} not found!")
#         return ""
    
#     with open(file_path, 'r', encoding='utf-8') as file:
#         message = file.read().strip()
    
#     if not message:
#         print(f"No message found in {file_path}")
    
#     return message

# # Function to read image paths from a text file
# def read_images(image_file):
#     print(f"Reading image paths from {image_file}")
#     if not os.path.exists(image_file):
#         print(f"Image file {image_file} not found!")
#         return []
    
#     with open(image_file, 'r', encoding='utf-8') as file:
#         image_paths = [line.strip() for line in file.readlines()]
    
#     if not image_paths:
#         print(f"No images found in {image_file}")
    
#     return image_paths

# # Main function to send WhatsApp messages with multiple images
# def send_bulk_messages(phone_file, message_file, image_file=None):
#     # Read the phone numbers, message, and image paths from files
#     phone_numbers = read_phone_numbers(phone_file)
#     message = read_message(message_file)
#     image_paths = read_images(image_file) if image_file else []

#     if not phone_numbers or not message:
#         print("Missing phone numbers or message. Exiting.")
#         return

#     print(f"Starting to send messages to {len(phone_numbers)} contacts...")

#     # Loop through each phone number and send the message
#     for phone in phone_numbers:
#         try:
#             print(f"Sending message to {phone}...")
            
#             # Send the message first
#             print(f"Sending message: {message}")
#             pywhatkit.sendwhatmsg_instantly(phone, message, 10, tab_close=True, close_time=3)
#             time.sleep(5)  # Add a delay after sending the message

#             # Now send each image to the contact
#             for image_path in image_paths:
#                 print(f"Sending image: {image_path}")
#                 pywhatkit.sendwhats_image(phone, image_path, "", 15, tab_close=True, close_time=3)
#                 time.sleep(5)  # Add a delay between sending images to avoid spamming

#         except Exception as e:
#             print(f"Failed to send message to {phone}: {e}")

# # Example usage:
# phone_file = r"phone_numbers.txt"
# message_file = r"message.txt"
# image_file = r"images.txt"  # Text file containing paths to images, one image per line

# send_bulk_messages(phone_file, message_file, image_file)
