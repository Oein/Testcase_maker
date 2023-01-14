#include <iostream>
#include <algorithm>
#include <stack>
#include <queue>
#include <vector>
#include <cmath>
#include <cstring>
#include <cstdlib>
#include <fstream>
#include <random>

using namespace std;

int main()
{
    int N;
    cin >> N;
    for (int i = 1; i < N; i++)
    {
        for (int j = 0; j < i; j++)
        {
            if (i >= 10)
                cout << i % 10;
            else
                cout << i;
        }
        cout << "\n";
    }
    for (int i = N; i > 0; i--)
    {
        for (int j = 0; j < i; j++)
        {
            if (i >= 10)
                cout << i % 10;
            else
                cout << i;
        }
        cout << "\n";
    }
    return 0;
}