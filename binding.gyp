{
  "targets": [
    {
      "target_name": "hello",
      "cflags!": [ "-fno-exceptions", "-fpermissive", "-std=c++17"],
      "cflags_cc!": [ "-fno-exceptions" ],
      "sources": [ "hello.cpp" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
    }
  ]
}