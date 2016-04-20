/*
 * 		STACKS
 */

struct
{
 int data[CAPACITY];
 int size;
}
stack;
stack.size = 0;

bool push (int datum)
{
	if(stack.size == CAPACITY){
		return false
	} else {
		stack.data[stack.size] = datum;
		stack.size++;
		return true;
	}
}

bool pop(int* location)
{
 if (stack.size == 0)
 {
 return false;
 }
 *location = stack.data[stack.size - 1];
 stack.size--;
 return true;
}

// - HASH FUNCTIONS -// 

typedef struct node
{
 char* word;
 struct node* next;
}node;
node* table[26];

// find all the words in table

unsigned int size(void)
{
	unsigned int size = 0;
	for (int i = 0; i < 26; i++) {
	 	node* ptr = table[i];
	 	while (ptr != NULL) {
	 		size++;
	 		ptr = ptr->next;
	 	}
	 }
	return size;
}
