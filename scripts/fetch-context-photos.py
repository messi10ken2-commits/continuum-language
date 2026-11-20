import concurrent.futures, urllib.request, pathlib
photos={'cooking':'1683624328172-88fb24625ec1','friends':'1758613170846-e468188aee84','library':'1754430543609-aae159c530ef','study-garden':'1660128359777-c7e5f29e4106','market':'1584771145729-0bd9fda6529b','reading-home':'1517401220137-9462c929bf9f','reading-water':'1560759861-132aa16d4267','market-clothes':'1676583821204-1c80b1293206','airport-lounge':'1760654343460-e38c0db08a71'}
def get(entry):
 name,source=entry
 url=f'https://images.unsplash.com/photo-{source}?auto=format&fit=crop&w=960&q=75&fm=jpg'
 data=urllib.request.urlopen(url,timeout=35).read()
 assert data[:2]==b'\xff\xd8'
 pathlib.Path(f'public/lesson-media/{name}-v2.jpg').write_bytes(data)
 return name,len(data)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
 for result in ex.map(get,photos.items()):print(result)
