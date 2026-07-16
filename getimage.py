import requests
from bs4 import BeautifulSoup
import os
import re
from urllib.parse import urljoin


URL = "https://democrats.org.il/candidates/"
OUTPUT_DIR = "images"

os.makedirs(OUTPUT_DIR, exist_ok=True)


headers = {
    "User-Agent": "Mozilla/5.0"
}


def clean_filename(text):
    text = text.strip()

    text = re.sub(
        r'[^\w\u0590-\u05FF]+',
        '_',
        text
    )

    return text.strip("_")


def extract_name_from_url(url):

    filename = url.split("/")[-1]

    # מוריד סיומת
    filename = os.path.splitext(filename)[0]

    # מוצא מה שבין המספר הראשון לבין candidatePhoto
    match = re.search(
        r'^\d+_(.*?)_candidatePhoto',
        filename
    )

    if match:
        return match.group(1)

    return None



response = requests.get(
    URL,
    headers=headers
)

response.raise_for_status()


soup = BeautifulSoup(
    response.text,
    "html.parser"
)


images = soup.select(
    'img[src*="candidatePhoto"]'
)


print(
    "Found:",
    len(images)
)


for img in images:

    image_url = urljoin(
        URL,
        img["src"]
    )


    name = extract_name_from_url(
        image_url
    )


    if not name:
        print(
            "Cannot extract name:",
            image_url
        )
        continue


    filename = (
        clean_filename(name)
        + ".jpg"
    )


    filepath = os.path.join(
        OUTPUT_DIR,
        filename
    )


    print(
        "Downloading:",
        filename
    )


    data = requests.get(
        image_url,
        headers=headers
    ).content


    with open(
        filepath,
        "wb"
    ) as f:
        f.write(data)


print("Done")