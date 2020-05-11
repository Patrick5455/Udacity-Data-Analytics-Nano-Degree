def factorial(n):
	x=1
	for i in range(1,n+1):
		x*=i
	return x

def binomial(n, k):
	n_factorial = factorial(n)
	print("n! =",  n_factorial,"\n")
	k_factorial = factorial(k)
	print("k! = ", k_factorial,"\n")
	k2_factorial = factorial(n-k)
	print("k2! =", k2_factorial,"\n")
	permutation = k_factorial * k2_factorial
	print("permutation =", permutation,"\n")
	probability = n_factorial/permutation
	print("probability =", probability,"\n")
	return probability
	



n = int(input("Enter n\n"))
k = int(input("Enter k\n"))

answer = binomial(n,k)

print(answer)

