import random

total_money = 1000
count2 = 0

while count2 < 15 and total_money > 0:
    count = 0
    bet = int(input("How much money do you want to bet "))
    while bet > total_money:
      print("Invald bet")
      bet = int(input("Please choose a valid amount "))
    random_num = random.randint(1, 100)
    if random_num < 21:
      total_money -= bet
      print("You lost")
    else:
      total_money += bet
      print("You won")
    print(total_money)
    count2 += 1