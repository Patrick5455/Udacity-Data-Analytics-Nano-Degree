def factorial(n):
	x=1
	for i in range(1,n+1):
		x*=i
	return x

def binomial(n, k):
	if k > n:
		return ("events(k) cannot be greater than times(n)")
	else:
		n_factorial = factorial(n)
		print("n! =",  n_factorial,"\n")
		k_factorial = factorial(k)
		print("k! = ", k_factorial,"\n")
		k2_factorial = factorial(n-k)
		print("k2! =", k2_factorial,"\n")
		k_divisor = k_factorial * k2_factorial
		print("k_divisor =", k_divisor,"\n")
		distribution = n_factorial/k_divisor
		print("distribution =", distribution,"\n")
		return distribution

def probability(n,k,v):
	outcome = binomial(n,k)
	v2=1-v
	v_pow = k
	v2_pow = n-k
	total_v = (v**v_pow)*(v2**v2_pow)
	probability = round(outcome*total_v,4)
	
	return probability
	

print("--- W e l c o m e  t o  P r o b a b i l i t y  C a l c u l a t o r ---")

n = int(input("Enter n\n"))
k = int(input("Enter k\n"))
v = float(input("Enter v\n"))

answer = probability(n,k,v)

print("possible outocmes(s): ", answer)

