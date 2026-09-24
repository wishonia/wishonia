// Generated route tree - do not edit manually
export const routeTree = {
  "name": "root",
  "path": "/",
  "isDynamic": false,
  "children": {
    "(frontpage)": {
      "name": "(frontpage)",
      "path": "/(frontpage)",
      "isDynamic": false,
      "children": {}
    },
    "agents": {
      "name": "agents",
      "path": "/agents",
      "isDynamic": false,
      "children": {
        "mine": {
          "name": "mine",
          "path": "/agents/mine",
          "isDynamic": false,
          "children": {}
        },
        "new": {
          "name": "new",
          "path": "/agents/new",
          "isDynamic": false,
          "children": {}
        }
      }
    },
    "articles": {
      "name": "articles",
      "path": "/articles",
      "isDynamic": false,
      "children": {
        "authors": {
          "name": "authors",
          "path": "/articles/authors",
          "isDynamic": false,
          "children": {}
        },
        "categories": {
          "name": "categories",
          "path": "/articles/categories",
          "isDynamic": false,
          "children": {}
        },
        "tags": {
          "name": "tags",
          "path": "/articles/tags",
          "isDynamic": false,
          "children": {}
        }
      }
    },
    "call-scheduler": {
      "name": "call-scheduler",
      "path": "/call-scheduler",
      "isDynamic": false,
      "children": {
        "account": {
          "name": "account",
          "path": "/call-scheduler/account",
          "isDynamic": false,
          "children": {}
        },
        "schedules": {
          "name": "schedules",
          "path": "/call-scheduler/schedules",
          "isDynamic": false,
          "children": {
            "new": {
              "name": "new",
              "path": "/call-scheduler/schedules/new",
              "isDynamic": false,
              "children": {}
            }
          }
        }
      }
    },
    "chat": {
      "name": "chat",
      "path": "/chat",
      "isDynamic": false,
      "children": {
        "id": {
          "name": "id",
          "path": "/chat/[id]",
          "isDynamic": true,
          "children": {}
        }
      }
    },
    "dashboard": {
      "name": "dashboard",
      "path": "/dashboard",
      "isDynamic": false,
      "children": {
        "settings": {
          "name": "settings",
          "path": "/dashboard/settings",
          "isDynamic": false,
          "children": {
            "connections": {
              "name": "connections",
              "path": "/dashboard/settings/connections",
              "isDynamic": false,
              "children": {}
            },
            "notifications": {
              "name": "notifications",
              "path": "/dashboard/settings/notifications",
              "isDynamic": false,
              "children": {}
            }
          }
        },
        "wishingWells": {
          "name": "wishingWells",
          "path": "/dashboard/wishingWells",
          "isDynamic": false,
          "children": {
            "wishingWellId": {
              "name": "wishingWellId",
              "path": "/dashboard/wishingWells/[wishingWellId]",
              "isDynamic": true,
              "children": {
                "settings": {
                  "name": "settings",
                  "path": "/dashboard/wishingWells/[wishingWellId]/settings",
                  "isDynamic": false,
                  "children": {}
                }
              }
            }
          }
        }
      }
    },
    "docs": {
      "name": "docs",
      "path": "/docs",
      "isDynamic": false,
      "children": {}
    },
    "github": {
      "name": "github",
      "path": "/github",
      "isDynamic": false,
      "children": {}
    },
    "globalProblems": {
      "name": "globalProblems",
      "path": "/globalProblems",
      "isDynamic": false,
      "children": {
        "new": {
          "name": "new",
          "path": "/globalProblems/new",
          "isDynamic": false,
          "children": {}
        },
        "results": {
          "name": "results",
          "path": "/globalProblems/results",
          "isDynamic": false,
          "children": {}
        },
        "globalProblemId": {
          "name": "globalProblemId",
          "path": "/globalProblems/[globalProblemId]",
          "isDynamic": true,
          "children": {
            "organizations": {
              "name": "organizations",
              "path": "/globalProblems/[globalProblemId]/organizations",
              "isDynamic": false,
              "children": {}
            },
            "people": {
              "name": "people",
              "path": "/globalProblems/[globalProblemId]/people",
              "isDynamic": false,
              "children": {}
            },
            "solutions": {
              "name": "solutions",
              "path": "/globalProblems/[globalProblemId]/solutions",
              "isDynamic": false,
              "children": {
                "globalSolutionId": {
                  "name": "globalSolutionId",
                  "path": "/globalProblems/[globalProblemId]/solutions/[globalSolutionId]",
                  "isDynamic": true,
                  "children": {}
                }
              }
            },
            "vote": {
              "name": "vote",
              "path": "/globalProblems/[globalProblemId]/vote",
              "isDynamic": false,
              "children": {}
            }
          }
        }
      }
    },
    "globalSolutions": {
      "name": "globalSolutions",
      "path": "/globalSolutions",
      "isDynamic": false,
      "children": {
        "new": {
          "name": "new",
          "path": "/globalSolutions/new",
          "isDynamic": false,
          "children": {}
        },
        "results": {
          "name": "results",
          "path": "/globalSolutions/results",
          "isDynamic": false,
          "children": {}
        },
        "globalSolutionId": {
          "name": "globalSolutionId",
          "path": "/globalSolutions/[globalSolutionId]",
          "isDynamic": true,
          "children": {
            "globalProblems": {
              "name": "globalProblems",
              "path": "/globalSolutions/[globalSolutionId]/globalProblems",
              "isDynamic": false,
              "children": {}
            },
            "results": {
              "name": "results",
              "path": "/globalSolutions/[globalSolutionId]/results",
              "isDynamic": false,
              "children": {}
            },
            "settings": {
              "name": "settings",
              "path": "/globalSolutions/[globalSolutionId]/settings",
              "isDynamic": false,
              "children": {}
            },
            "tasks": {
              "name": "tasks",
              "path": "/globalSolutions/[globalSolutionId]/tasks",
              "isDynamic": false,
              "children": {}
            }
          }
        }
      }
    },
    "orb": {
      "name": "orb",
      "path": "/orb",
      "isDynamic": false,
      "children": {}
    },
    "organizations": {
      "name": "organizations",
      "path": "/organizations",
      "isDynamic": false,
      "children": {
        "slug": {
          "name": "slug",
          "path": "/organizations/[slug]",
          "isDynamic": true,
          "children": {
            "dashboard": {
              "name": "dashboard",
              "path": "/organizations/[slug]/dashboard",
              "isDynamic": false,
              "children": {}
            }
          }
        }
      }
    },
    "petitions": {
      "name": "petitions",
      "path": "/petitions",
      "isDynamic": false,
      "children": {
        "create": {
          "name": "create",
          "path": "/petitions/create",
          "isDynamic": false,
          "children": {}
        },
        "my-referrals": {
          "name": "my-referrals",
          "path": "/petitions/my-referrals",
          "isDynamic": false,
          "children": {}
        },
        "my-signatures": {
          "name": "my-signatures",
          "path": "/petitions/my-signatures",
          "isDynamic": false,
          "children": {}
        },
        "id": {
          "name": "id",
          "path": "/petitions/[id]",
          "isDynamic": true,
          "children": {
            "admin": {
              "name": "admin",
              "path": "/petitions/[id]/admin",
              "isDynamic": false,
              "children": {}
            },
            "analytics": {
              "name": "analytics",
              "path": "/petitions/[id]/analytics",
              "isDynamic": false,
              "children": {}
            }
          }
        }
      }
    },
    "profile": {
      "name": "profile",
      "path": "/profile",
      "isDynamic": false,
      "children": {}
    },
    "researcher": {
      "name": "researcher",
      "path": "/researcher",
      "isDynamic": false,
      "children": {
        "enhance": {
          "name": "enhance",
          "path": "/researcher/enhance",
          "isDynamic": false,
          "children": {}
        }
      }
    },
    "search": {
      "name": "search",
      "path": "/search",
      "isDynamic": false,
      "children": {
        "search": {
          "name": "search",
          "path": "/search/search",
          "isDynamic": false,
          "children": {
            "id": {
              "name": "id",
              "path": "/search/search/[id]",
              "isDynamic": true,
              "children": {}
            }
          }
        },
        "id": {
          "name": "id",
          "path": "/search/[id]",
          "isDynamic": true,
          "children": {}
        }
      }
    },
    "voters": {
      "name": "voters",
      "path": "/voters",
      "isDynamic": false,
      "children": {
        "id": {
          "name": "id",
          "path": "/voters/[id]",
          "isDynamic": true,
          "children": {}
        }
      }
    },
    "wish": {
      "name": "wish",
      "path": "/wish",
      "isDynamic": false,
      "children": {}
    },
    "wishingWells": {
      "name": "wishingWells",
      "path": "/wishingWells",
      "isDynamic": false,
      "children": {
        "results": {
          "name": "results",
          "path": "/wishingWells/results",
          "isDynamic": false,
          "children": {}
        },
        "wishingWellId": {
          "name": "wishingWellId",
          "path": "/wishingWells/[wishingWellId]",
          "isDynamic": true,
          "children": {}
        }
      }
    }
  }
} as const;

export type RouteNode = {
  name: string;
  path: string;
  isDynamic: boolean;
  children: { [key: string]: RouteNode };
};
