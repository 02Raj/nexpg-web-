import requests

url = 'https://api.sarvam.ai/text-to-speech'
headers = {
    'api-subscription-key': 'sk_ernivt1p_T9igElZrIrHxZ1zxpu77PPza',
    'Content-Type': 'application/json'
}
payload = {
    'inputs': ['Hello world'],
    'target_language_code': 'en-IN',
    'speaker': 'anushka',
    'model': 'bulbul:v3',
    'pace': 1.05,
    'speech_sample_rate': 24000,
    'enable_preprocessing': True
}

r = requests.post(url, headers=headers, json=payload)
print("STATUS CODE:", r.status_code)
print("RESPONSE:", r.text)
