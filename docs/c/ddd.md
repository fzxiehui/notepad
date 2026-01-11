# C语言领域驱动设计(核心目标)

## 项目地址

- `git@github.com:fzxiehui/cddd.git`

## 领域依赖

> 重要: `Infrastructure` 通过`实现接口`反向依赖`Domain`，而不是`Domain`依赖`Infrastructure`.

![domain](/c/domain.svg)

## 依赖允许表

| from \ to      | Domain | Application | Infrastructure | CLI |
| :------------- | :----: | :---------: | :------------: | :-: |
| Domain         | Y      | N           | N              | N   |
| Application    | Y      | Y           | N              | N   |
| Infrastructure | Y      | N           | Y              | N   |
| CLI            | Y      | Y           | N              | Y   |
| main           | Y      | Y           | Y              | Y   |


## 领域驱动设计目录说明

```shell
.
├── CMakeLists.txt
├── compile_commands.json -> build/compile_commands.json
├── src
│   ├── application                 # service 应用服务层
│   │   ├── book_service.c
│   │   ├── book_service.h
│   │   └── dto
│   │       └── book_dto.h          # domain 数据转换
│   ├── cli                         # interface(cli)
│   │   ├── book_cli.c
│   │   ├── book_cli.h
│   │   ├── cli.c
│   │   └── cli.h
│   ├── CMakeLists.txt              # 构建文件
│   ├── domain                      # 核心领域
│   │   └── book
│   │       ├── book.c
│   │       ├── book.h
│   │       └── book_repo.h
│   ├── infrastructure              # 基础设施层
│   │   ├── json
│   │   │   ├── book_dto_json.c
│   │   │   └── book_dto_json.h
│   │   └── persistence             # 持久化(基础设施)
│   │       ├── book_repo_file.c
│   │       ├── book_repo_file.h
│   │       ├── book_repo_memory.c
│   │       └── book_repo_memory.h
│   └── main.c
└── third_party                     # 第三方依赖包
    └── cjson
        ├── cJSON.c
        ├── cJSON.h
        └── CMakeLists.txt

```

## 文件解析(根目录)

### `CMakeLists.txt`

```cmake
cmake_minimum_required(VERSION 3.15)
project(ddd C)

set(CMAKE_C_STANDARD 11)

# compile_commands.json 文件
# ln -sf build/compile_commands.json .
# 让nvim coc 可以找到 这个依赖包
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
# 添加cjson 依赖
add_subdirectory(third_party/cjson)
add_subdirectory(src)
```

### `compile_commands.json`

```shell
# 软连接 用于nvim 补全
ln -sf build/compile_commands.json .
```

## 文件解析(service)

### `src/application/book_service.h`

> 声明业务函数由`src/application/book_service.c`实现

```c
#ifndef APPLICATION_BOOK_SERVICE_H
#define APPLICATION_BOOK_SERVICE_H

#include "../domain/book/book_repo.h"
#include "./dto/book_dto.h"

int book_create_service(struct book_repo *repo,
                        int id,
                        const char *title);

int book_rename_service(struct book_repo *repo,
                        int id,
                        const char *new_title);

// 通过 dto 数据创建 book
int book_create_from_dto(struct book_repo *repo,
                         const struct book_dto *dto);

int book_get_book_dto(struct book_repo *repo, 
		int id, struct book_dto *dto);
#endif
```

### `src/application/book_service.c`

> 业务实现, 依赖于`domain`与`domain`中的抽象`repo`并不在乎如何存\取,
> 存取功能由`src/infrastructure/persistence/`实现. 
> 由`main`或`cli(interface)`层级定义使用哪种方法进行存\取.

```c
#include "book_service.h"
#include "../domain/book/book.h"
#include "../domain/book/book_repo.h"
#include "dto/book_dto.h"
#include <string.h>
#include <stdio.h>

/* 通过id与title创建book */
int book_create_service(struct book_repo *repo,
                        int id,
                        const char *title)
{
	struct book b;

	if (!repo || !repo->save)
		return -1;

	if (book_init(&b, id, title) != 0)
		return -1;

	return repo->save(repo, &b);
}

/* 通过 id 改标题 */ 
int book_rename_service(struct book_repo *repo,
                        int id,
                        const char *new_title)
{
	struct book b;

	if (!repo || !repo->load || !repo->save)
		return -1;

	if (repo->load(repo, id, &b) != 0)
		return -1;

	if (book_rename(&b, new_title) != 0)
		return -1;

	return repo->save(repo, &b);
}

/* 通过dto创建 book */
int book_create_from_dto(struct book_repo *repo,
                         const struct book_dto *dto)
{
    struct book b;

    if (!repo || !dto)
        return -1;

    /* 领域规则在这里生效 */
    if (book_init(&b, dto->id, dto->title) != 0)
        return -1;

    return repo->save(repo, &b);
}

/* 通过 book id 获取dto 形式的book */
int book_get_book_dto(struct book_repo *repo,
                      int id,
                      struct book_dto *dto)
{
    if (!repo || !dto)
        return -1;

    struct book b;
    if (repo->load(repo, id, &b) != 0)
        return -1;

    memset(dto, 0, sizeof(*dto));
    dto->id = b.id;
    snprintf(dto->title, sizeof(dto->title), "%s", b.title);

    return 0;
}
```

### `src/application/dto/book_dto.h`

> `interface`层与`service`层数据差异转换, 
> 如在`http`常使用`json`, 而在c开发层级使用`struct`, 
> 所以有转换过程.

```c
#ifndef APPLICATION_BOOK_DTO_H
#define APPLICATION_BOOK_DTO_H

#define BOOK_TITLE_MAX 64

/* dto 定义 */
struct book_dto {
	int  id;
	char title[BOOK_TITLE_MAX];
};

#endif
```

## 文件解析(interface)

### `src/cli/book_cli.c`

> - 重点
> - 依赖`application(service)`, `infrastructure`, 
> 由当前文件决定`repo`为`book_repo_file`, 并使用`service`,
> 实现`cli`功能
> - 依赖方向为: `cli` -> `service` & `infrastructure` -> `domain`
> - 运行方向为: `cli` -> `service` -> `domain` -> 反转使用`infrastructure`

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "book_cli.h"
#include "application/book_service.h"
#include "application/dto/book_dto.h"

/* repo 注入点 */
#include "infrastructure/persistence/book_repo_file.h"

int book_cli_run(int argc, char **argv)
{
	/* repo */
	struct book_repo repo;
	file_book_repo_init(&repo, "./books.db");

	if (argc < 2) {
		printf("usage: ddd book <add><get>\n");
		return -1;
	}

	if (strcmp(argv[1], "add") == 0) {
		if (argc < 4) {
			printf("usage: app book add <id> <title>\n");
			return -1;
		}
		book_create_service(&repo, atoi(argv[2]), argv[3]);

		return 0;
	}

	if (strcmp(argv[1], "get") == 0) {
		if (argc < 3) {
			printf("usage: app book get <id>\n");
			return -1;
		}
			struct book_dto dto = {};
			book_get_book_dto(&repo, atoi(argv[2]), &dto);
			printf("%s\n", dto.title);

		return 0;
	}

	printf("unknown book command\n");
	return -1;
}
```

### `src/cli/book_cli.h`

> 非重点

```c
#ifndef BOOK_CLI_H
#define BOOK_CLI_H

int book_cli_run(int argc, char **argv);

#endif
```

### `src/cli/cli.c`

> 非重点, 一级cli用于区分功能

```c
#include <stdio.h>
#include <string.h>
#include "cli.h"
#include "book_cli.h"

int cli_run(int argc, char **argv)
{
    if (argc < 2) {
        printf("usage: app <command>\n");
        return -1;
    }

    if (strcmp(argv[1], "book") == 0) {
        return book_cli_run(argc - 1, argv + 1);
    }

    printf("unknown command: %s\n", argv[1]);
    return -1;
}
```

### `src/cli/cli.h`

> 非重点

```c
#ifndef CLI_H
#define CLI_H

int cli_run(int argc, char **argv);

#endif
```

## 文件解析(domain)

### `src/domain/book/book.c`

> 领域行为

```c
#include "book.h"
#include <string.h>

/* 初始化 book */
int book_init(struct book *b, int id, const char *title)
{
	if (!b || !title || id <= 0)
		return -1;

	memset(b, 0, sizeof(*b));
	b->id = id;
	strncpy(b->title, title, BOOK_TITLE_MAX - 1);
	return 0;
}

/* 修改 title */
int book_rename(struct book *b, const char *new_title)
{
	if (!b || !new_title || strlen(new_title) == 0)
		return -1;

	strncpy(b->title, new_title, BOOK_TITLE_MAX - 1);
	return 0;
}
```

### `src/domain/book/book.h`

> 领域定义

```c
#ifndef DOMAIN_BOOK_H
#define DOMAIN_BOOK_H

#define BOOK_TITLE_MAX 64

struct book {
	int  id;
	char title[BOOK_TITLE_MAX];
};

/* 领域行为 */
/* 初始化 book */
int book_init(struct book *b, int id, const char *title);
/* 修改 title */
int book_rename(struct book *b, const char *new_title);

#endif
```

### `src/domain/book/book_repo.h`

> 领域内抽象仓储接口 由`infrastructure`具体实现.

```c
#ifndef DOMAIN_BOOK_REPO_H
#define DOMAIN_BOOK_REPO_H

struct book;

/*
 * 仓储接口（抽象）
 * 定义完成, 在main 或 cli 层级组装
 * 具体实现在infrastructure/persistence 中完成
 * 这样可以达到依赖反转目的
 * */
struct book_repo {
	int (*save)(struct book_repo *self, const struct book *b);
	int (*load)(struct book_repo *self, int id, struct book *out);
	void *ctx;   // repo 私有数据（文件路径 / FILE* 等）
};

#endif
```

## 文件解析(infrastructure)

### `src/infrastructure/json/book_dto_json.h`

```c
#ifndef BOOK_DTO_JSON_H
#define BOOK_DTO_JSON_H

#include "application/dto/book_dto.h"

/*使用json 初始化 dto*/
int book_dto_from_json(const char *json, struct book_dto *dto);

#endif
```

### `src/infrastructure/json/book_dto_json.c`

```c
#include "cJSON.h"
#include "../../application/dto/book_dto.h"
#include <string.h>

int book_dto_from_json(const char *json, struct book_dto *dto)
{
    cJSON *root = cJSON_Parse(json);
    if (!root)
        return -1;

    cJSON *id = cJSON_GetObjectItem(root, "id");
    cJSON *title = cJSON_GetObjectItem(root, "title");

    if (!cJSON_IsNumber(id) || !cJSON_IsString(title)) {
        cJSON_Delete(root);
        return -1;
    }

    dto->id = id->valueint;
    strncpy(dto->title, title->valuestring, BOOK_TITLE_MAX - 1);

    cJSON_Delete(root);
    return 0;
}
```

### `src/infrastructure/persistence/book_repo_file.h`

```c
#ifndef FILE_BOOK_REPO_H
#define FILE_BOOK_REPO_H

#include "domain/book/book_repo.h"

void file_book_repo_init(struct book_repo *repo, const char *path);

#endif
```

### `src/infrastructure/persistence/book_repo_file.c`

```c
#include <stdio.h>
#include <string.h>
#include "../../domain/book/book.h"
#include "../../domain/book/book_repo.h"

struct file_repo_ctx {
    const char *path;
};

static int file_save(struct book_repo *self, const struct book *b)
{
    struct file_repo_ctx *ctx = self->ctx;
    FILE *fp = fopen(ctx->path, "a");
    if (!fp)
        return -1;

    fprintf(fp, "%d|%s\n", b->id, b->title);
    fclose(fp);
    return 0;
}

static int file_load(struct book_repo *self, int id, struct book *out)
{
    struct file_repo_ctx *ctx = self->ctx;
    FILE *fp = fopen(ctx->path, "r");
    if (!fp)
        return -1;

    char line[256];
    while (fgets(line, sizeof(line), fp)) {
        int fid;
        char title[128];

        if (sscanf(line, "%d|%127[^\n]", &fid, title) == 2) {
            if (fid == id) {
                out->id = fid;
                strncpy(out->title, title, sizeof(out->title) - 1);
                fclose(fp);
                return 0;
            }
        }
    }

    fclose(fp);
    return -1;
}

void file_book_repo_init(struct book_repo *repo, const char *path)
{
    static struct file_repo_ctx ctx;
    ctx.path = path;

    repo->save = file_save;
    repo->load = file_load;
    repo->ctx  = &ctx;
}
```

### `src/infrastructure/persistence/book_repo_memory.h`

```c
#ifndef BOOK_REPO_MEMORY_H
#define BOOK_REPO_MEMORY_H

#include "domain/book/book_repo.h"

extern struct book_repo memory_book_repo;

#endif
```

### `src/infrastructure/persistence/book_repo_memory.c`

```c
#include "../../domain/book/book.h"
#include "../../domain/book/book_repo.h"
// #include <string.h>

static struct book g_store;
static int g_has_data = 0;

static int mem_save(struct book_repo *self, const struct book *b)
{
	g_store = *b;
	g_has_data = 1;
	return 0;
}

static int mem_load(struct book_repo *self, int id, struct book *b)
{
	if (!g_has_data || g_store.id != id)
		return -1;

	*b = g_store;
	return 0;
}

/* 对外暴露的仓储实现 */
struct book_repo memory_book_repo = {
    .save = mem_save,
    .load = mem_load,
};
```

## 文件解析(main)

### `src/CMakeLists.txt`

```cmake
add_executable(ddd
	main.c
)

target_sources(ddd PRIVATE
	cli/cli.c
	cli/book_cli.c

	domain/book/book.c
	application/book_service.c

	infrastructure/persistence/book_repo_memory.c
	infrastructure/persistence/book_repo_file.c

	infrastructure/json/book_dto_json.c
)

# 添加cjson
target_link_libraries(ddd PRIVATE cjson)

target_include_directories(ddd PRIVATE
	${CMAKE_CURRENT_SOURCE_DIR}
)
```

### `src/main.c`

```c
#include "cli/cli.h"

int main(int argc, char **argv)
{
	return cli_run(argc, argv);
}
```
