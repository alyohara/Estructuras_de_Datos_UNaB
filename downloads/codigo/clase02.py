
#area de funciones
def triangulares(t):
	if(t == 1):
		#print(1)
		return 1
	else:
		x = t+triangulares(t-1)
		#print(x)
		return(x)
#programa principal			
resultado =(triangulares(6))
print(resultado)

#area de funciones
def factorial(n):
	if(n==0):
		#print(1)
		return 1
	elif(n==1):
		#print(1)
		return 1
	elif(n>0):
		x = n*factorial(n-1)
		#print(x)
		return x 
		
#programa principal		
resultado =factorial(5)
print(resultado)


#area de funciones
def fibonacci_iterativo(n):
	a = 0
	b = 1
	fib = 0
	if(n == 0)or (n == 1):
		fib = n
	else:
		#n es mayor igual a 2
		i = 2
		while(i <= n):
			fib = a+b #sumamos los valores
			a = b #actualizamos el valor de a
			b = fib #la suma de los anteriores
			i = i+1
	return fib
#programa principal
resultado = fibonacci_iterativo(11)	
print(resultado)		

########################################################################			

#area de funciones
def fibonacci_recursivo(n):
	if(n==0):
		return 0
	elif(n==1):
		return 1
	else:
		return fibonacci_recursivo(n-1)+fibonacci_recursivo(n-2)
#programa principal
resultado = fibonacci_recursivo(11)
print(resultado)		
		
	
