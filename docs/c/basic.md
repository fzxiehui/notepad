# 基础

## 变量

```c
#include <stdio.h>

int main(void) {

	// char 0x00 - 0xff
	char c = 'a'; //or char c = 0x61;
	printf("char: %c\n", c);	

	// int -2147483648 to 2147483647
	int i = 123456;
	printf("int: %d\n", i);

	// float sign 1 bit, exponent 8 bit fraction 23 bit
	float f = 123456.123456;
	printf("float: %f\n", f);

	// float sign 1 bit, exponent 11 bit fraction 52 bit
	double d = 654321.654321;
	printf("double: %.2f\n", d);

	printf("chat to int: %d\n", (int)c);

	const int LENGTH = 10;
	// LENGTH = 11 Error!
	printf("const int : %d\n", LENGTH);

	#define PI 3.14
	printf("#define: %.2f\n", PI);

	// auto 作用域只在函数里, 会自动销毁
	auto int auto_p = 123456;
	printf("auto int: %d\n", auto_p);

	static int count = 10;
	count++;
	printf("static int: %d\n", count);

	return 0;
}
```

## 流程

- 判断

```c
#include <stdio.h>

int main(void) {
	
	int tag = 0;
	if (tag) {
		printf("tag == 0\n");
	} else if (tag == 1) {
		printf("tag == 1\n");
	}
	else {
		printf("tag != 0 and tag != 1\n");
	}

	switch (tag) {
	case 1:	
		printf("case 1 \n");
	case 2:	
		printf("case 2 \n");
	default: 
		printf("default\n");
	}

	return 0;
}
```

- 循环

```c
#include <stdio.h>

int main(void) {
	
	int tag = 0;
	for(;;) {
		printf("hello\n");
		tag++;
		if (tag == 3) {
			break;
		}
	}

	tag = 0;
	do {
		printf("hello\n");
		tag++;
	}while (tag < 3);

	tag = 0;

	while (tag < 3) {
		printf("hello\n");
		tag++;
	}

	for (int i = 0; i < 3;  i++) {
		continue;
		printf("hello\n");
	}

	return 0;
}
```

## 指针与数组

```c
#include <stdio.h>
#include <string.h>

int main(void) {
	
	char *str = "abcdefg";

	printf("str : %s\n", str);

	// 获取字符串长度 <string.h>
	// 也可以用 sizeof(str) / sizeof(str[0]); 
	// 但是会有提示
	int str_len = strlen(str) + 1;
	printf("str len: %d\n", str_len);

	// 用指针操作数组
	char *p = str;
	for (int i = 0; i < str_len; i++) {
		printf("%c ", *p++);
	}
	printf("\n");

	// 自动取长度
	char str1[] = {'a', 'b', 'c'};
	printf("str1: %s\n", str1);


	// 固定长度
	char str2[100] = {'a', 'b', 'c'};
	printf("str2: %s\n", str2);
	// 数组长度
	str_len = sizeof(str2) / sizeof(str2[0]);
	printf("list len: %d\n", str_len);
	return 0;
}
```

## 枚举

```c
#include <stdio.h>
 
enum DAY {
	MON=1, TUE, WED, THU, FRI, SAT, SUN
};
 
int main(void) {
	enum DAY day;
	day = WED;
	printf("enum day wed = %d\n", day);
	return 0;
}
```

## 函数指针与回调函数

```c
#include <stdio.h>
 
void println(char *msg) {
	printf("%s\n", msg);
}

void cb_print(char *msg, void (*p) (char *)) {
	printf("cb_print: ");
	p(msg);
	return;
}
 
int main(void) {

	// 函数指针
	void (*p)(char*) = & println;
	p("hello");

	// 回调函数
	cb_print("hello cb_print", &println);

	return 0;
}
```

## 结构体


```c
#include <stdio.h>
#include <string.h>
 
struct Book {
    int id;
    char title[64];
    char author[50];
};

struct Book new_book(int id, const char *title, const char *author) 
{
	struct Book book = {0};
	book.id = id;

	strncpy(book.title, title, sizeof(book.title) - 1);
	strncpy(book.author, author, sizeof(book.author) - 1);

	return book;
}


// 使用这种方法初始化更好
int book_init(struct Book *this,
              int id,
              const char *title,
              const char *author)
{
	if (!this || !title || !author)
		return -1;

	memset(this, 0, sizeof(*this));

	this->id = id;

	strncpy(this->title, title, sizeof(this->title) - 1);
	strncpy(this->author, author, sizeof(this->author) - 1);

	return 0;
}

void book_print(const struct Book *this) {
	printf("id: %d\ntitle: %s\nauthor: %s\n",
				 this->id, this->title, this->author);
}
 
int main(void) 
{
	struct Book book = new_book(1, "hello world", "12345678");
	printf("%s\n", book.title);

	// 使用初始化方法更好
	if (book_init(&book, 1, "hello init", "init func") != 0) {
			printf("init failed\n");
			return -1;
	}
	book_print(&book);

	return 0;
}
```
