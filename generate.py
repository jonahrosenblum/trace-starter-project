import random
import json

obj = {}
suppliers ={'flour':[],'yeast':[],'sugar':[]}
vendors = ["Julia's Bakery", "Wind's Flour Mill", "Breads R Us", "Cake Bake", "Marvelous Market"]
for ven in vendors:
    obj[ven] = {'flour':{},'yeast':{}, 'sugar':{}}
    for ing in obj[ven]:
        if random.random() > .7:
            continue
        obj[ven][ing]['price'] = round(random.random() * 10,2)
        obj[ven][ing]['quantity'] = random.randint(1,1000)
        suppliers[ing].append(ven)
    delete = [key for key in obj[ven] if obj[ven][key] == {}] 
    for key in delete:
        del obj[ven][key]

print(json.dumps(obj))
print(json.dumps(suppliers))